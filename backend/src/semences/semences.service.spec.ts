import { Test, TestingModule } from '@nestjs/testing';
import { SemencesService } from './semences.service';

describe('SemencesService', () => {
  let service: SemencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemencesService],
    }).compile();

    service = module.get<SemencesService>(SemencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
