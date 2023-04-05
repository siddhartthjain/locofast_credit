import { Module } from '@nestjs/common';
import { SupplierController } from './controllers/SupplierController';
import { FabricSupplierAddressRepository } from './repositories';
import { SupplierService } from './services/SupplierService';
import { CommonModule } from '@app/_common';
import { FABRIC_SUPPLIER_ADDRESS_REPOSITORY } from './constants';

@Module({
  imports: [CommonModule],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    {
      provide: FABRIC_SUPPLIER_ADDRESS_REPOSITORY,
      useClass: FabricSupplierAddressRepository,
    },
  ],
  exports: [
    {
      provide: FABRIC_SUPPLIER_ADDRESS_REPOSITORY,
      useClass: FabricSupplierAddressRepository,
    },
  ],
})
export class SupplierModule {}
