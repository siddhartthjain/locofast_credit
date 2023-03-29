import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FabricModule } from 'src/fabric/module';
import {
  FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
} from './constants';
import { ProvisionalOrderController } from './controllers';
import { OrderController } from './controllers/OrderController';
import { FabricOrderRepository } from './repositories';
import { FabricOrderDeliveryAddressRepository } from './repositories/database/FabricOrderDeliveryAddress';
import { OrderService } from './services/OrderService';
import { ProvisionalOrderService } from './services/ProvisionalOrderService';

@Module({
  controllers: [OrderController, ProvisionalOrderController],
  imports: [FabricModule, CoreModule],
  providers: [
    OrderService,
    ProvisionalOrderService,
    {
      provide: FABRIC_ORDER_REPOSITORY,
      useClass: FabricOrderRepository,
    },
    {
      provide: FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
      useClass: FabricOrderDeliveryAddressRepository,
    },
  ],
  exports: [
    {
      provide: FABRIC_ORDER_REPOSITORY,
      useClass: FabricOrderRepository,
    },
    {
      provide: FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
      useClass: FabricOrderDeliveryAddressRepository,
    },
  ],
})
export class OrderModule {}
