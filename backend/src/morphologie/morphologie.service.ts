import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDetectionMorphologiqueDto } from './dto/create-morphologie.dto';
import { Model, Types } from 'mongoose';
import { DetectionMorphologique, MorphologyDocument } from './schemas/morphologie.schema';
import { InjectModel } from '@nestjs/mongoose';

export class MorphologyNotFoundException extends Error {
  constructor(id: string) {
    super(`Morphology with id ${id} not found`);
  }
}

@Injectable()
export class MorphologieService {
  constructor(
    @InjectModel(DetectionMorphologique.name)
    private readonly morphologyModel: Model<MorphologyDocument>,
  ) {}

  async create(
    createMorphologieDto: CreateDetectionMorphologiqueDto,
  ): Promise<DetectionMorphologique> {
    return await this.morphologyModel.create(createMorphologieDto);
  }

  async findAll(): Promise<DetectionMorphologique[]> {
    return await this.morphologyModel.find().lean();
  }

  async findOne(id: string): Promise<DetectionMorphologique> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid id format (${id})`);
    const morphology = await this.morphologyModel.findById(id);
    if (!morphology) throw new MorphologyNotFoundException(id);
    return morphology;
  }

  async remove(id: string): Promise<DetectionMorphologique> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException(`Invalid id format (${id})`);
    const morphology = await this.morphologyModel.findByIdAndDelete(id);
    if (!morphology) throw new MorphologyNotFoundException(id);
    return morphology;
  }
}
