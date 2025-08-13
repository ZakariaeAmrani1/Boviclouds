import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Identification } from './schemas/identification.schema';
import * as ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { Express } from 'express';
import { S3Service } from 'src/common/s3/s3.service';
import { IDENTIFICATION_BUCKET } from './constants/identification.constants';
import { HttpService } from '@nestjs/axios';
import { AIService } from 'src/common/ai/ai.service';
export class IndentificationNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Identification with ID ${id} not found`);
  }
}

export class IdentificationAlreadyExistsException extends ConflictException {
  constructor(nni: string) {
    super(`Identification with NNI ${nni} already exists`);
  }
}
@Injectable()
export class IdentificationService {
  constructor(
    @InjectModel(Identification.name)
    private readonly identificationModel: Model<Identification>,
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService,
    private readonly aiService:AIService
  ) {}

  async findAll(query: any): Promise<Identification[]> {
    return this.identificationModel.find().exec();
  }

  async filter(filters: {
    nni?: string;
    date_naissance?: string;
    race?: string;
  }) {
    const query: any = {};

    if (filters.nni) query['infos_sujet.nni'] = filters.nni;
    if (filters.date_naissance)
      query['infos_sujet.date_naissance'] = new Date(filters.date_naissance);
    if (filters.race) query['infos_sujet.race'] = filters.race;

    return this.identificationModel.find(query).lean();
  }

  async create(
    createDto: CreateIdentificationDto,
    photos: Express.Multer.File[],
  ): Promise<Identification> {
    const existing = await this.identificationModel.findOne({
      'infos_sujet.nni': createDto.infos_sujet.nni,
    });
    if (existing)
      throw new IdentificationAlreadyExistsException(createDto.infos_sujet.nni);
    const imagePaths = await this.uploadPhotosToS3(
      photos,
      IDENTIFICATION_BUCKET,
      createDto.infos_sujet.nni,
    );
    createDto.infos_sujet.photos = imagePaths;
    // console.log('Image paths:', imagePaths);
    // console.log('Create DTO:', createDto);
    const created = await this.identificationModel.create(createDto);
    await this.aiService.sendCowNNIToMuzzleModel(createDto.infos_sujet.nni);
    return await created.save();
  }

  private async uploadPhotoToS3(
    photo: Express.Multer.File,
    bucket: string,
    cowNNI: string,
  ): Promise<string> {
    const key = `${cowNNI}/${cowNNI}-${Date.now()}-${photo.originalname}`;
    await this.s3Service.uploadFile({
      bucket,
      key,
      file: photo.buffer,
    });
    return await this.s3Service.getFileUrl(bucket, key);
  }

  private async uploadPhotosToS3(
    photos: Express.Multer.File[],
    bucket: string,
    cowNNI: string,
  ): Promise<string[]> {
    const uploadedUrls: string[] = await Promise.all(
      photos.map(async (file) => {
        const url = await this.uploadPhotoToS3(file, bucket, cowNNI);
        return url;
      }),
    );
    return uploadedUrls;
  }

  // Export identifications to CSV or Excel
  async export(
    format: 'csv' | 'excel',
    filters: {
      nni?: string;
      date_naissance?: string;
      race?: string;
    },
  ) {
    const data = await this.filter(filters);

    if (format === 'csv') {
      const parser = new Parser();
      return parser.parse(data);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Identifications');

    const columns = Object.keys(data[0] || {}).flatMap((key) => {
      if (typeof data[0][key] === 'object' && data[0][key] !== null) {
        return Object.keys(data[0][key]).map((subKey) => ({
          header: `${key}.${subKey}`,
          key: `${key}.${subKey}`,
        }));
      }
      return [{ header: key, key }];
    });

    worksheet.columns = columns;

    data.forEach((item) => {
      const row = {};
      for (const col of columns) {
        const [mainKey, subKey] = col.key.split('.');
        row[col.key] = subKey ? item[mainKey]?.[subKey] || '' : item[mainKey];
      }
      worksheet.addRow(row);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async findById(id: string): Promise<Identification> {
    if (!Types.ObjectId.isValid(id))
      throw new IndentificationNotFoundException(id);
    const identification = await this.identificationModel.findById(id).exec();
    if (!identification) throw new IndentificationNotFoundException(id);
    return identification;
  }

  async update(
    id: string,
    updateDto: Partial<CreateIdentificationDto>,
  ): Promise<Identification> {
    if (!Types.ObjectId.isValid(id))
      throw new IndentificationNotFoundException(id);
    const updated = await this.identificationModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) throw new IndentificationNotFoundException(id);
    return updated;
  }

  async delete(id: string): Promise<Identification> {
    if (!Types.ObjectId.isValid(id))
      throw new IndentificationNotFoundException(id);
    const result = await this.identificationModel.findByIdAndDelete(id);
    if (!result) {
      throw new IndentificationNotFoundException(id);
    }
    return result;
  }
}
