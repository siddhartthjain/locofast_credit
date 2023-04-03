import { Module } from '@nestjs/common';
// import { PdcModule } from '@app/pdc';
import { RedisModule } from '@app/redis';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/module';
import { SupplierModule } from './supplier/module';
import { FabricModule } from './fabric';
import { CommonModule } from './_common';
import { CoreModule } from '@libs/core';
import { InvoicingRootModule } from './Invoicing_root/module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CommonModule,
    RedisModule,
    OrderModule,
    SupplierModule,
    FabricModule,
    CoreModule,
    InvoicingRootModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
