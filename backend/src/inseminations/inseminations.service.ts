import { Injectable } from '@nestjs/common';
import { CreateInseminationDto } from './dto/create-insemination.dto';
import { UpdateInseminationDto } from './dto/update-insemination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Insemination } from './schemas/insemination.schema';
import { Model } from 'mongoose';

@Injectable()
export class InseminationsService {

  constructor(@InjectModel(Insemination.name) private readonly inseminationModel:Model<Insemination>){}

  async create(createInseminationDto: CreateInseminationDto) {
    const createdInsemination = new this.inseminationModel(createInseminationDto);
    return await createdInsemination.save()
  }

  async findAll():Promise<Insemination[] | null> {
    return await this.inseminationModel.find();
  }

  async findOne(id: string):Promise<Insemination | null>  {
    return await this.inseminationModel.findById(id);
  }

  async update(id: string, updateInseminationDto: UpdateInseminationDto) {
    return await this.inseminationModel.findByIdAndUpdate(id,updateInseminationDto)
  }

  async remove(id: string) {
    return await this.inseminationModel.findByIdAndDelete(id);
  }
}
