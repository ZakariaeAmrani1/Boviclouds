import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLactationDto } from './dto/create-lactation.dto';
import { UpdateLactationDto } from './dto/update-lactation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lactation } from './schemas/lactation.schema';
import { Model } from 'mongoose';

export class LactationNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Lactation with ID (${id}) not found`, HttpStatus.NOT_FOUND);
  }
}

@Injectable()
export class LactationService {
  constructor(
    @InjectModel(Lactation.name) private readonly lactationModel: Model<Lactation>,
  ) {}

  async findAll() {
    return await this.lactationModel.find().lean();
  }

  async create(createLactationDto: CreateLactationDto) {
    const lactation = new this.lactationModel(createLactationDto);
    return await lactation.save();
  }

  async findOne(id: string) {
    const lactation = await this.lactationModel.findById(id);
    if (!lactation) throw new LactationNotFoundException(id);
    return lactation;
  }

  async update(id: string, updateLactationDto: UpdateLactationDto) {
    const lactation = await this.lactationModel.findByIdAndUpdate(id, updateLactationDto, { new: true });
    if (!lactation) throw new LactationNotFoundException(id);
    return lactation;
  }

  async remove(id: string) {
    const lactation = await this.lactationModel.findByIdAndDelete(id);
    if (!lactation) throw new LactationNotFoundException(id);
    return lactation;
  }
}
