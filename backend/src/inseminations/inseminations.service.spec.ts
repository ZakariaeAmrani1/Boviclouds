import { Test, TestingModule } from '@nestjs/testing';
import { InseminationsService } from './inseminations.service';

describe('InseminationsService', () => {
  let service: InseminationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InseminationsService],
    }).compile();

    service = module.get<InseminationsService>(InseminationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
