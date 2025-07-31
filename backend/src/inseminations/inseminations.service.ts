import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateInseminationDto } from './dto/create-insemination.dto';
import { UpdateInseminationDto } from './dto/update-insemination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Insemination } from './schemas/insemination.schema';
import { Model, Types } from 'mongoose';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import type { File as MulterFile } from 'multer';

export class InseminationNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Insemination with ID (${id}) not found`, HttpStatus.NOT_FOUND);
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
    return await this.inseminationModel
      .find()
      .exec();
  }

  async findOne(id: string): Promise<Insemination | null> {
    if (!Types.ObjectId.isValid(id)) throw new InseminationNotFoundException(id);
    const insemination = await this.inseminationModel.findById(id);
    if (!insemination) throw new InseminationNotFoundException(id);
    return insemination;
  }

  async update(
    id: string,
    updateInseminationDto: UpdateInseminationDto,
  ): Promise<Insemination> {
    if (!Types.ObjectId.isValid(id)) throw new InseminationNotFoundException(id);
    const insemination = await this.inseminationModel.findByIdAndUpdate(
      id,
      updateInseminationDto,
      { new: true },
    );
    if (!insemination) throw new InseminationNotFoundException(id);
    return insemination;
  }

  async remove(id: string): Promise<Insemination> {
    if (!Types.ObjectId.isValid(id))
          throw new InseminationNotFoundException(id);
    const insemination = await this.inseminationModel.findByIdAndDelete(id);
    if (!insemination) throw new InseminationNotFoundException(id);
    return insemination;
  }

  async importInseminations(file: MulterFile) {
    if (!file) throw new BadRequestException('No file uploaded');

    const requiredFields = [
      'nni',
      'semence_id',
      'date_dissemination',
      'inseminateur_id',
      'responsable_local_id',
    ];
    const rows: Record<string, any>[] = [];

    const isCSV = file.originalname.endsWith('.csv');

    if (isCSV) {
      const bufferStream = require('streamifier').createReadStream(file.buffer);

      return new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (row: Record<string, any>) => {
            if (this.hasEmptyFields(row, requiredFields)) {
              reject(
                new BadRequestException(
                  `Missing fields: ${JSON.stringify(row)}`,
                ),
              );
            } else {
              rows.push(row);
            }
          })
          .on('end', async () => {
            await this.inseminationModel.insertMany(rows);
            resolve({
              message: 'CSV imported successfully',
              count: rows.length,
            });
          })
          .on('error', (err) => reject(err));
      });
    } else {
      // Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      for (const row of data as Record<string, any>[]) {
        if (this.hasEmptyFields(row, requiredFields)) {
          throw new BadRequestException(
            `Missing fields: ${JSON.stringify(row)}`,
          );
        }
        rows.push(row);
      }

      await this.inseminationModel.insertMany(rows);
      return { message: 'Excel imported successfully', count: rows.length };
    }
  }

  private hasEmptyFields(row: Record<string, any>, required: string[]) {
  return required.some(field => !row[field] || row[field].toString().trim() === '');
}
}
