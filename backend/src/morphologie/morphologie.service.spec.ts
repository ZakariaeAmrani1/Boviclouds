import { Test, TestingModule } from '@nestjs/testing';
import { MorphologieService } from './morphologie.service';

describe('MorphologieService', () => {
  let service: MorphologieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MorphologieService],
    }).compile();

    service = module.get<MorphologieService>(MorphologieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
