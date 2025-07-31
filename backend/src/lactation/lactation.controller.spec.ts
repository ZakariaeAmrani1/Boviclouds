import { Test, TestingModule } from '@nestjs/testing';
import { LactationController } from './lactation.controller';
import { LactationService } from './lactation.service';

describe('LactationController', () => {
  let controller: LactationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LactationController],
      providers: [LactationService],
    }).compile();

    controller = module.get<LactationController>(LactationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
