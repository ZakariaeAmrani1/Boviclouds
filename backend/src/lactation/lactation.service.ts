import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLactationDto } from './dto/create-lactation.dto';
import { UpdateLactationDto } from './dto/update-lactation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lactation } from './schemas/lactation.schema';
import { Model, Types } from 'mongoose';
import { LactationQueryDto } from './dto/lactation-quey.dto';
import { UserRole } from 'src/users/schemas/users/user.role';

export class LactationNotFountiondException extends HttpException {
  constructor(id: string) {
    super(`Lactation with ID (${id}) not found`, HttpStatus.NOT_FOUND);
  }
}
@Injectable()
export class LactationService {
  constructor(
    @InjectModel(Lactation.name)
    private readonly lactationModel: Model<Lactation>,
  ) {}

  async findAll(
    query: LactationQueryDto,
    user:any
  ): Promise<{
    lacations: Lactation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      sujet_id,
      n_lactation,
      date_min,
      date_max,
      page = 1,
      limit = 10,
    } = query;
    const filter: any = {};
    if (sujet_id) filter.sujet_id = new RegExp(sujet_id, 'i');
    if (n_lactation !== undefined) filter.n_lactation = n_lactation;
    if (date_min || date_max) {
      filter.date_velage = {};
      if (date_min) filter.date_velage.$gte = new Date(date_min);
      if (date_max) filter.date_velage.$lte = new Date(date_max);
    }
    if (user?.role?.includes(UserRole.CONTROLEUR_LAITIER)) {
      filter.controleur_laitier_id = user.userId;
    }
    const skip = (page - 1) * limit;
    const [lactations, total] = await Promise.all([
      this.lactationModel.find(filter).skip(skip).limit(limit).exec(),
      this.lactationModel.countDocuments(filter).exec(),
    ]);
    return {
      lacations: lactations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(user:any,createLactationDto: CreateLactationDto) {
    if (
      !user?.role?.some((role) => role.includes(UserRole.CONTROLEUR_LAITIER) || 
      role.includes(UserRole.ADMIN))
    )
      throw new HttpException('Unauthorized! Only admin user or controller can add lactations!', HttpStatus.UNAUTHORIZED);
    return await this.lactationModel.create(createLactationDto);
  }

  async findOne(id: string): Promise<Lactation | null> {
    if (!Types.ObjectId.isValid(id))
      throw new LactationNotFountiondException(id);
    const lactation = await this.lactationModel.findById(id).exec();
    if (!lactation) throw new LactationNotFountiondException(id);
    return lactation;
  }

  async update(
    id: string,
    updateLactationDto: UpdateLactationDto,
  ): Promise<Lactation> {
    if (!Types.ObjectId.isValid(id))
      throw new LactationNotFountiondException(id);
    const lactation = await this.lactationModel
      .findByIdAndUpdate(id, updateLactationDto, { new: true })
      .exec();
    if (!lactation) throw new LactationNotFountiondException(id);
    return lactation;
  }

  async remove(id: string): Promise<Lactation> {
    if (!Types.ObjectId.isValid(id))
      throw new LactationNotFountiondException(id);
    const lactation = await this.lactationModel.findByIdAndDelete(id).exec();
    if (!lactation) throw new LactationNotFountiondException(id);
    return lactation;
  }
}
