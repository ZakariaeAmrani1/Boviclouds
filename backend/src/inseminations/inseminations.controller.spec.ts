import { Test, TestingModule } from '@nestjs/testing';
import { InseminationsController } from './inseminations.controller';
import { InseminationsService } from './inseminations.service';

describe('InseminationsController', () => {
  let controller: InseminationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InseminationsController],
      providers: [InseminationsService],
    }).compile();

    controller = module.get<InseminationsController>(InseminationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
