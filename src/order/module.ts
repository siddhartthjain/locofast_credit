import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FabricModule } from 'src/fabric/module';
import {
  FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
  FABRIC_ORDER_DISPATCH_REPOSITORY,
  FABRIC_ORDER_FILE_REPOSITORY,
  FABRIC_ORDER_META_DATA_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
} from './constants';
import { ProvisionalOrderController } from './controllers';
import { OrderController } from './controllers/OrderController';
import {
  FabricOrderDispatchRepository,
  FabricOrderFileRepository,
  FabricOrderMetaDataRepository,
  FabricOrderRepository,
} from './repositories';
import { FabricOrderDeliveryAddressRepository } from './repositories/database/FabricOrderDeliveryAddress';
import { OrderService } from './services/OrderService';
import { ProvisionalOrderService } from './services/ProvisionalOrderService';
import { CommonModule } from '@app/_common';
import { MediaModule } from '@app/media/module';

@Module({
  controllers: [OrderController, ProvisionalOrderController],
  imports: [FabricModule, CoreModule, CommonModule, MediaModule],
  providers: [
    OrderService,
    ProvisionalOrderService,
    {
      provide: FABRIC_ORDER_REPOSITORY,
      useClass: FabricOrderRepository,
    },
    {
      provide: FABRIC_ORDER_DISPATCH_REPOSITORY,
      useClass: FabricOrderDispatchRepository,
    },
    {
      provide: FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
      useClass: FabricOrderDeliveryAddressRepository,
    },
    {
      provide: FABRIC_ORDER_META_DATA_REPOSITORY,
      useClass: FabricOrderMetaDataRepository,
    },
    {
      provide: FABRIC_ORDER_FILE_REPOSITORY,
      useClass: FabricOrderFileRepository,
    },
  ],
  exports: [
    {
      provide: FABRIC_ORDER_REPOSITORY,
      useClass: FabricOrderRepository,
    },
    {
      provide: FABRIC_ORDER_DISPATCH_REPOSITORY,
      useClass: FabricOrderDispatchRepository,
    },
    {
      provide: FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
      useClass: FabricOrderDeliveryAddressRepository,
    },
    {
      provide: FABRIC_ORDER_META_DATA_REPOSITORY,
      useClass: FabricOrderMetaDataRepository,
    },
  ],
})
export class OrderModule {}
