import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rebouclage } from './schemas/rebouclage.schema';
import { CreateRebouclageDto, CreateRebouclageAutomaticDto } from './dto/create-rebouclage.dto';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { Parser as Json2CsvParser } from 'json2csv';

@Injectable()
export class RebouclageService {
  constructor(
    @InjectModel(Rebouclage.name)
    private rebouclageModel: Model<Rebouclage>,
  ) {}

  async create(dto: CreateRebouclageDto): Promise<Rebouclage> {
    return this.rebouclageModel.create(dto);
  }

  async findAll(): Promise<Rebouclage[]> {
    return this.rebouclageModel.find().populate('identificateur_id').exec();
  }

  async findByIdentificateur(identificateurId: string): Promise<Rebouclage[]> {
    return this.rebouclageModel
      .find({ identificateur_id: identificateurId })
      .exec();
  }

  async delete(id: string): Promise<Rebouclage | null> {
    return this.rebouclageModel.findByIdAndDelete(id);
  }

  async exportRebouclages(format: 'csv' | 'excel') {
    const rebouclages = await this.rebouclageModel.find().lean();

    if (format === 'csv') {
      const parser = new Json2CsvParser({
        fields: [
          'operation_id',
          'id_sujet',
          'ancien_nni',
          'nouveau_nni',
          'date_creation',
        ],
      });
      return parser.parse(rebouclages);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rebouclages');
    worksheet.columns = [
      { header: 'Opération ID', key: 'operation_id' },
      { header: 'Sujet ID', key: 'id_sujet' },
      { header: 'Ancien NNI', key: 'ancien_nni' },
      { header: 'Nouveau NNI', key: 'nouveau_nni' },
      { header: 'Date de création', key: 'date_creation' },
    ];
    worksheet.addRows(rebouclages);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
  async findFiltered(filters: any) {
    const query: any = {};
    if (filters.ancien_nni) query.ancien_nni = filters.ancien_nni;
    if (filters.nouveau_nni) query.nouveau_nni = filters.nouveau_nni;
    if (filters.date_debut && filters.date_fin) {
      query.date_creation = {
        $gte: new Date(filters.date_debut),
        $lte: new Date(filters.date_fin),
      };
    }
    return this.rebouclageModel.find(query);
  }
}
