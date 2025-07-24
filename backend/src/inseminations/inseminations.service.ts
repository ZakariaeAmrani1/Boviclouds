import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInseminationDto } from './dto/create-insemination.dto';
import { UpdateInseminationDto } from './dto/update-insemination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Insemination } from './schemas/insemination.schema';
import { Model } from 'mongoose';

export class InseminationNotFoundException extends HttpException{
  constructor(id:string){
    super(`Insemination with ID (${id}) not found`,HttpStatus.NOT_FOUND);
  }
}
@Injectable()
export class InseminationsService {
  constructor(
    @InjectModel(Insemination.name)
    private readonly inseminationModel: Model<Insemination>,
  ) {}

  async create(
    createInseminationDto: CreateInseminationDto,
  ): Promise<Insemination> {
    const createdInsemination = new this.inseminationModel(
      createInseminationDto,
    );
    return await createdInsemination.save();
  }

  async findAll(): Promise<Insemination[]> {
    return await this.inseminationModel.find().lean();
  }

  async findOne(id: string): Promise<Insemination | null> {
    const insemination = await this.inseminationModel.findById(id);
    if (!insemination) throw new InseminationNotFoundException(id);
    return insemination;
  }

  async update(
    id: string,
    updateInseminationDto: UpdateInseminationDto,
  ): Promise<Insemination> {
    const insemination = await this.inseminationModel.findByIdAndUpdate(
      id,
      updateInseminationDto,
      { new: true },
    );
    if (!insemination) throw new InseminationNotFoundException(id);
    return insemination;
  }

  async remove(id: string): Promise<Insemination> {
    const insemination = await this.inseminationModel.findByIdAndDelete(id);
    if (!insemination) throw new InseminationNotFoundException(id);
    return insemination;
  }
}
