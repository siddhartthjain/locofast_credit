import {
  ALLOWED_FILE_TYPES,
  FILE_TITLE,
  INVOICING_FILES_REPOSITORY,
  InvoicingFilesContract,
  getFormattedDateString,
} from '@app/_common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import moment from 'moment';
import {
  FABRIC_ORDER_DISPATCH_REPOSITORY,
  FABRIC_ORDER_FILE_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
  FILE_TYPE,
  ORDER_STATUS,
} from '../constants';
import { checkQuantity } from '../helpers';
import { FabricOrder } from '../models';
import {
  FabricOrderContract,
  FabricOrderDipatchContract,
  FabricOrderFileContract,
} from '../repositories';
import { BaseValidator } from '@libs/core/validator';
import { DeliveredOrder } from '../validators/DeliveredOrder';
import { ConfirmOrder, DispatchOrder } from '../validators';
import { FileService, MediaService } from '@app/media/services';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'objection';

@Injectable()
export class OrderService {
  private orderFilesBucket;
  constructor(
    @Inject(FABRIC_ORDER_REPOSITORY) private fabricOrder: FabricOrderContract,
    @Inject(FABRIC_ORDER_DISPATCH_REPOSITORY)
    private fabricOrderDispatch: FabricOrderDipatchContract,
    @Inject(INVOICING_FILES_REPOSITORY)
    private invoicingFiles: InvoicingFilesContract,
    @Inject(FABRIC_ORDER_FILE_REPOSITORY)
    private fabricOrderFile: FabricOrderFileContract,
    private validator: BaseValidator,
    private fileService: FileService,
    private s3MediaService: MediaService,
    private readonly config: ConfigService,
  ) {
    const serviceConfig = this.config.get('services');
    const { s3: s3ServiceConfig } = serviceConfig;
    this.orderFilesBucket = s3ServiceConfig.order.bucketName;
  }

  async getOrders(inputs: Record<string, any>) {
    const { orderTab, limit, sortOrder, pageNo } = inputs;
    const user = {
      role: '21',
      orgId: 2,
    };
    return this.fabricOrder.getOrders({
      orderTab,
      limit,
      sortOrder,
      user,
      pageNo,
    });
  }

  async getActiveOrders() {
    const user = {
      role: '21',
      orgId: 2,
    };
    const data = await this.fabricOrder.getActiveOrders(user);
    return data;
  }

  async confirmOrder(inputs: Record<string, any>) {
    const user = {
      role: '17',
      oid: 2, // will be 1 LocoAdmin brand
      uid: 1,
    };
    const proformaFileMetaData = await this.confirmOrderCustomValidator(
      inputs,
      user,
    );

    const trx = await FabricOrder.startTransaction();
    try {
      await this.fileUpload(proformaFileMetaData, inputs.orderId, user, trx);

      const orderConfirmedOn = getFormattedDateString(new Date().toISOString());
      await this.fabricOrder
        .query(trx)
        .patch({
          status: ORDER_STATUS.CREATED,
          orderConfirmedOn,
        })
        .where({
          id: inputs.orderId,
          status: ORDER_STATUS.PROVISIONAL,
        });
      await trx.commit();
    } catch (error) {
      console.log('Error in confirming Order', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }

    return;
  }

  async dispatchOrder(inputs: Record<string, any>) {
    const { orderId } = inputs;
    const user = {
      role: '22',
      oid: 4,
      uid: 4,
    };
    const { dispatchDetails, dispatchFilesMetaData } =
      await this.dispatchOrderCustomValidator(inputs, user);

    const trx = await FabricOrder.startTransaction();
    try {
      await this.fileUpload(dispatchFilesMetaData, orderId, user, trx);

      await this.fabricOrder
        .query(trx)
        .patch({
          status: ORDER_STATUS.DISPATCHED,
          modified_by: user.uid,
        })
        .where({
          id: orderId,
        });

      await this.fabricOrderDispatch.query(trx).insert(dispatchDetails);
      await trx.commit();
    } catch (error) {
      console.log('Error marking order dispatch: ', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }
    return;
  }

  async markOrderDelivered(inputs: Record<string, any>) {
    const { deliveredDate, proofOfDeliveryMetaData } =
      await this.markOrderDeliveredCustomValidator(inputs);
    const user = {
      role: '22',
      oid: 4,
      uid: 4,
    };
    const { orderId } = inputs;

    const trx = await FabricOrder.startTransaction();
    try {
      await this.fileUpload(proofOfDeliveryMetaData, orderId, user, trx);

      await this.fabricOrder
        .query(trx)
        .patch({
          status: ORDER_STATUS.DELIVERED,
          markedDeliveredBy: 3,
          modifiedBy: 3,
        })
        .where({
          id: orderId,
        });

      await this.fabricOrderDispatch
        .query(trx)
        .patch({
          deliveredDate,
          modifiedBy: 3,
        })
        .where({ orderId });
      // will have to add modifiedBy field too (Supplier)
      // have to upload files too
      await trx.commit();
    } catch (error) {
      console.log('Error marking order dispatch: ', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }
    return;
  }

  async getOrderDetails(inputs: Record<string, any>) {
    const user = {
      role: '22',
      orgId: 2,
    };
    inputs.user = user;
    const data = await this.fabricOrder.getOrderDetails(inputs);
    return data;
  }

  async fileUpload(
    files: Record<string, any>[],
    orderId: string,
    user: Record<string, any>,
    trx: Transaction,
  ) {
    /*
 {
    mimeType: 'application/pdf',
    fileSize: 0.221765,
    originalName: 'Screenshot-(119)_1680890503753_1958.pdf',
    fileUrl: 'https://lftest-media.s3.ap-south-1.amazonaws.com/Screenshot-(119)_1680890503753_1958.pdf',
    fieldName: 'Order Pictures'
  },
*/
    const { oid, uid } = user;

    await Promise.all(
      files.map(async (file) => {
        const { fieldName, originalName, mimeType, fileUrl } = file;
        const invoicingFile = await this.invoicingFiles.query(trx).insert({
          name: originalName,
          title: fieldName,
          org_id: oid,
          file_type: ALLOWED_FILE_TYPES[mimeType] || 0,
          mimeType,
          url: fileUrl,
          createdBy: uid,
          modifiedBy: uid,
        });

        await this.fabricOrderFile.query(trx).insert({
          orderId,
          fileId: invoicingFile.id,
          fileType: FILE_TYPE[fieldName] || 0,
          createdBy: uid,
          modifiedBy: uid,
        });
      }),
    );
  }

  async dispatchOrderCustomValidator(
    inputs: Record<string, any>,
    user: Record<string, any>,
  ): Promise<Record<string, any>> {
    await this.validator.fire(inputs, DispatchOrder);

    const { orderPictures, locofastInvoice, orderId, quantity } = inputs;
    const fabricOrder = await this.fabricOrder.firstWhere({
      id: orderId,
    });
    if (fabricOrder.status != ORDER_STATUS.CREATED) {
      throw new UnprocessableEntityException('Cannot Mark This Order');
    }

    if (!checkQuantity(parseFloat(fabricOrder.quantity), quantity)) {
      throw new UnprocessableEntityException('This is not the order quantity');
    }

    if (orderPictures.length > 4) {
      throw new UnprocessableEntityException('Can Only Add upto 4 Pictures');
    }

    const orderFiles = [];
    orderPictures.forEach((picture) => {
      const file = {
        url: picture,
        fieldName: FILE_TITLE.orderPicture,
      };
      orderFiles.push(file);
    });

    orderFiles.push({
      url: locofastInvoice,
      fieldName: FILE_TITLE.locofastInvoice,
    });

    const dispatchFilesMetaData = await this.orderFilesCustomValidator(
      orderFiles,
    );

    const dispatchDate = getFormattedDateString(new Date().toISOString());
    const dispatchDetails = {
      orderId,
      quantity,
      dispatchDate,
      created_by: user.uid,
      modified_by: user.uid,
    };

    return { dispatchDetails, dispatchFilesMetaData };
  }

  async markOrderDeliveredCustomValidator(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    await this.validator.fire(inputs, DeliveredOrder);
    const { orderId, proofOfDelivery } = inputs;
    const fabricOrder = await this.fabricOrder.firstWhere({
      id: orderId,
    });

    if (fabricOrder.status != ORDER_STATUS.DISPATCHED) {
      throw new UnprocessableEntityException('Cannot Mark This Order');
    }

    const deliveredDate = getFormattedDateString(inputs.deliveredDate);
    const diff = moment(deliveredDate).diff(new Date(), 'days');
    if (diff > 60) {
      throw new UnprocessableEntityException(
        'Delivered Cannot Be More Than 60 Days',
      );
    }

    const proofOfDeliveryFile = [
      { url: proofOfDelivery, fieldName: FILE_TITLE.deliveryProof },
    ];

    const proofOfDeliveryMetaData = await this.orderFilesCustomValidator(
      proofOfDeliveryFile,
    );

    return { deliveredDate, proofOfDeliveryMetaData };
  }

  async confirmOrderCustomValidator(
    inputs: Record<string, any>,
    user: Record<string, any>,
  ): Promise<Record<string, any>[]> {
    await this.validator.fire(inputs, ConfirmOrder);

    const { orderId, proformaInvoice } = inputs;

    const orderDetails = await this.fabricOrder.firstWhere({ id: orderId });

    if (orderDetails.status != ORDER_STATUS.PROVISIONAL) {
      throw new UnprocessableEntityException(`Order Already Confirmed!`);
    }

    const proformaInvoiceFile = [
      {
        url: proformaInvoice,
        fieldName: FILE_TITLE.proformaInvoice,
      },
    ];

    const proformaInvoiceMetaData = await this.orderFilesCustomValidator(
      proformaInvoiceFile,
    );

    return proformaInvoiceMetaData;
  }

  async orderFilesCustomValidator(
    orderFiles: Record<string, any>[],
  ): Promise<Record<string, any>[]> {
    const orderFilesMetaData = [];

    await Promise.all(
      orderFiles.map(async (orderFile) => {
        orderFile.url = decodeURI(orderFile.url);
        const orderFileMetaData =
          await this.fileService.parseFileMetadataFromUrl(orderFile.url);
        orderFileMetaData.fieldName = orderFile.fieldName;
        orderFilesMetaData.push(orderFileMetaData);
      }),
    );

    const metaDataToVerify = orderFilesMetaData.map((metaData) => {
      const { mimeType, fileSize } = metaData;
      return {
        fileMetaData: { mimeType, fileSize },
      };
    });

    this.fileService.validateFiles(metaDataToVerify);

    const objectsToCopy = orderFilesMetaData.map((file) => {
      return {
        fileName: file.originalName,
        targetBucket: this.orderFilesBucket,
      };
    });

    const newOrderFiles = await this.s3MediaService.copyObjectsToTargetBucket(
      objectsToCopy,
    );

    orderFilesMetaData.forEach((fileMetaData, index) => {
      fileMetaData.fileUrl = newOrderFiles[index].fileUrl;
    });

    return orderFilesMetaData;
  }
}
