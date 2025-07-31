import { Test, TestingModule } from '@nestjs/testing';
import { LactationService } from './lactation.service';

describe('LactationService', () => {
  let service: LactationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LactationService],
    }).compile();

    service = module.get<LactationService>(LactationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
