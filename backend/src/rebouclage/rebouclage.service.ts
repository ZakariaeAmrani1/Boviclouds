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

  async createAutomatic(dto: CreateRebouclageAutomaticDto, image: Express.Multer.File): Promise<Rebouclage> {
    try {
      // Mock OCR processing - in real implementation, you would use an OCR service
      // like Google Vision API, AWS Textract, or a custom OCR solution
      const extractedNNI = await this.processImageForNNI(image);

      // Create the full DTO with extracted NNI
      const fullDto: CreateRebouclageDto = {
        operation_id: dto.identificateur_id,
        id_sujet: 'placeholder', // This should be derived from the ancien_nni
        ancien_nni: extractedNNI,
        nouveau_nni: dto.nouveau_nni,
        date_creation: dto.date_creation || new Date().toISOString(),
        identificateur_id: dto.identificateur_id,
        mode: 'automatic' as any
      };

      return this.rebouclageModel.create(fullDto);
    } catch (error) {
      throw new Error(`Error processing automatic rebouclage: ${error.message}`);
    }
  }

  private async processImageForNNI(image: Express.Multer.File): Promise<string> {
    // Mock OCR implementation
    // In a real application, you would:
    // 1. Use an OCR service (Google Vision, AWS Textract, etc.)
    // 2. Process the image buffer
    // 3. Extract the NNI using pattern recognition
    // 4. Validate the extracted NNI format

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock extracted NNI - in real implementation, this would come from OCR
    const mockNNI = `FR${Date.now().toString().slice(-10)}`;

    // You could also validate the image quality, size, etc.
    if (image.size > 5 * 1024 * 1024) {
      throw new Error('Image size too large');
    }

    if (!image.mimetype.startsWith('image/')) {
      throw new Error('Invalid file type - must be an image');
    }

    return mockNNI;
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
