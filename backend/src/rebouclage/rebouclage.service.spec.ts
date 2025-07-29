import { Test, TestingModule } from '@nestjs/testing';
import { RebouclageService } from './rebouclage.service';

describe('RebouclageService', () => {
  let service: RebouclageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RebouclageService],
    }).compile();

    service = module.get<RebouclageService>(RebouclageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
