import { Module } from '@nestjs/common';
import { FABRIC_REPOSITORY } from './constants';
import { FabricController } from './controllers/FabricController';
import { FabricRepository } from './repositories';
import { FabricService } from './services/FabricService';

@Module({
  controllers: [FabricController],
  providers: [
    FabricService,
    {
      provide: FABRIC_REPOSITORY,
      useClass: FabricRepository,
    },
  ],
  exports: [
    FabricService,
    {
      provide: FABRIC_REPOSITORY,
      useClass: FabricRepository,
    },
  ],
})
export class FabricModule {}
