import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Identification, IdentificationDocument } from './schemas/identification.schema';
import * as ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import { CreateIdentificationDto } from './dto/create-identification.dto';

@Injectable()
export class IdentificationService {
  
  constructor(
    @InjectModel(Identification.name)
    private readonly identificationModel: Model<IdentificationDocument>,
  ) {}
  
 async findAll(query: any): Promise<Identification[]> {
  const filters: any = {};

  if (query.nni) filters['infos_sujet.nni'] = query.nni;
  if (query.race) filters['infos_sujet.race'] = query.race;
  if (query.date_naissance) filters['infos_sujet.date_naissance'] = new Date(query.date_naissance);

  return this.identificationModel.find(filters).exec();
 }

  async filter(filters: {
    nni?: string;
    date_naissance?: string;
    race?: string;
  }) {
    const query: any = {};

    if (filters.nni) query['infos_sujet.nni'] = filters.nni;
    if (filters.date_naissance) query['infos_sujet.date_naissance'] = new Date(filters.date_naissance);
    if (filters.race) query['infos_sujet.race'] = filters.race;

    return this.identificationModel.find(query).lean();
  }
    async create(createDto: CreateIdentificationDto): Promise<Identification> {
    const created = new this.identificationModel(createDto);
    return await created.save();
  }

  async export(format: 'csv' | 'excel', filters: {
    nni?: string;
    date_naissance?: string;
    race?: string;
  }) {
    const data = await this.filter(filters);

    if (format === 'csv') {
      const parser = new Parser();
      return parser.parse(data);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Identifications');

    const columns = Object.keys(data[0] || {}).flatMap((key) => {
      if (typeof data[0][key] === 'object' && data[0][key] !== null) {
        return Object.keys(data[0][key]).map(subKey => ({
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
  async delete(id: string): Promise<any> {
  const result = await this.identificationModel.findByIdAndDelete(id);
  if (!result) {
    throw new NotFoundException(`Identification with ID ${id} not found`);
  }
  return { message: 'Identification supprimée avec succès' };
 }

}
