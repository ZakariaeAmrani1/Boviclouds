import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSemenceDto } from './dto/create-semence.dto';
import { UpdateSemenceDto } from './dto/update-semence.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Semence } from './schemas/semence.schema';
import { Model } from 'mongoose';

export class SemenceNotFoundException extends HttpException{
  constructor(id:string){
    super(`Semence with ID (${id}) not found`,HttpStatus.NOT_FOUND);
  }
}
@Injectable()
export class SemencesService {
  constructor(
    @InjectModel(Semence.name) private readonly semenceModel: Model<Semence>,
  ) {}
  async create(createSemenceDto: CreateSemenceDto) {
    const semence = new this.semenceModel(createSemenceDto);
    return await semence.save();
  }

  async findAll() {
    return await this.semenceModel.find().lean();
  }

  async findOne(id: string) {
    const semence = await this.semenceModel.findById(id);
    if (!semence) throw new SemenceNotFoundException(id);
    return semence;
  }
  async findByIdentificator(identificator: string) {
    const semence = await this.semenceModel.findOne({identificateur:identificator});
    if (!semence) throw new SemenceNotFoundException(identificator);
    return semence;
  }

  async update(id: string, updateSemenceDto: UpdateSemenceDto) {
    const semence = await this.semenceModel.findByIdAndUpdate(id,updateSemenceDto,{new:true});
    if (!semence) throw new SemenceNotFoundException(id);
    return semence;

  }

  async remove(id: string) {
        const semence = await this.semenceModel.findByIdAndDelete(
          id
        );
        if (!semence) throw new SemenceNotFoundException(id);
        return semence;
  }
}
