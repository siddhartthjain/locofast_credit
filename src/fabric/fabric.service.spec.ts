import { Test, TestingModule } from '@nestjs/testing';
import { FabricService } from './services/FabricService';

describe('FabricService', () => {
  let service: FabricService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FabricService],
    }).compile();

    service = module.get<FabricService>(FabricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
