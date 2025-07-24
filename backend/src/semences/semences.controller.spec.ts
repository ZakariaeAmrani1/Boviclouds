import { Test, TestingModule } from '@nestjs/testing';
import { SemencesController } from './semences.controller';
import { SemencesService } from './semences.service';

describe('SemencesController', () => {
  let controller: SemencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemencesController],
      providers: [SemencesService],
    }).compile();

    controller = module.get<SemencesController>(SemencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
