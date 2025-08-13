import { Test, TestingModule } from '@nestjs/testing';
import { MorphologieController } from './morphologie.controller';
import { MorphologieService } from './morphologie.service';

describe('MorphologieController', () => {
  let controller: MorphologieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MorphologieController],
      providers: [MorphologieService],
    }).compile();

    controller = module.get<MorphologieController>(MorphologieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
