import { Module } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from './constants';
import { SupplierController } from './controllers/SupplierController';
import { SupplierRepository } from './repositories';
import { SupplierService } from './services/SupplierService';

@Module({
  controllers: [SupplierController],
  providers: [
    SupplierService,
    {
      provide: SUPPLIER_REPOSITORY,
      useClass: SupplierRepository,
    },
  ],
  exports: [
    {
      provide: SUPPLIER_REPOSITORY,
      useClass: SupplierRepository,
    },
  ],
})
export class SupplierModule {}
