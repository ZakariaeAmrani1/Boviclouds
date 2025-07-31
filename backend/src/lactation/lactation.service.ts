import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLactationDto } from './dto/create-lactation.dto';
import { UpdateLactationDto } from './dto/update-lactation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lactation } from './schemas/lactation.schema';
import { Model } from 'mongoose';
import { UserRole } from 'src/users/schemas/users/user.role';

export class LactationNotFoundException extends HttpException {
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

  async findAll(): Promise<Lactation[]> {
    return this.lactationModel.find().exec();
  }

  async create(user: any, createLactationDto: CreateLactationDto) {
    const isAuthorized =
      user?.role?.includes(UserRole.CONTROLEUR_LAITIER) ||
      user?.role?.includes(UserRole.ADMIN);

    if (!isAuthorized) {
      throw new HttpException(
        'Unauthorized! Only admin or controller can add lactations.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.lactationModel.create(createLactationDto);
  }

  async findOne(id: string) {
    const lactation = await this.lactationModel.findById(id).exec();
    if (!lactation) throw new LactationNotFoundException(id);
    return lactation;
  }

  async update(id: string, updateLactationDto: UpdateLactationDto) {
    const updated = await this.lactationModel
      .findByIdAndUpdate(id, updateLactationDto, {
        new: true,
      })
      .exec();

    if (!updated) throw new LactationNotFoundException(id);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.lactationModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new LactationNotFoundException(id);
    return deleted;
  }
}
