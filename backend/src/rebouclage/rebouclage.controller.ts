import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RebouclageService } from './rebouclage.service';

import { UserRole } from 'src/users/schemas/users/user.role';
import { CreateRebouclageDto, CreateRebouclageAutomaticDto, RebouclageMode } from './dto/create-rebouclage.dto';



@Controller('api/v1/rebouclages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.IDENTIFICATEUR, UserRole.ADMIN)
export class RebouclageController {
  constructor(private readonly rebouclageService: RebouclageService) {}


  @Post()
  create(@Body() dto: CreateRebouclageDto) {
    return this.rebouclageService.create(dto);
  }

  @Post('automatic')
  @UseInterceptors(FileInterceptor('image'))
  async createAutomatic(
    @Body() data: string,
    @UploadedFile() image: Express.Multer.File
  ) {
    try {
      // Parse the JSON data from the request
      const parsedData = JSON.parse(data);
      const dto: CreateRebouclageAutomaticDto = {
        nouveau_nni: parsedData.nouveauNNI,
        identificateur_id: parsedData.identificateur_id,
        date_creation: parsedData.dateRebouclage,
        mode: 'automatic' as any
      };

      if (!image) {
        throw new Error('Image is required for automatic mode');
      }

      return await this.rebouclageService.createAutomatic(dto, image);
    } catch (error) {
      throw new Error(`Error processing automatic rebouclage: ${error.message}`);
    }
  }

  @Get()
  getAll() {
    return this.rebouclageService.findAll();
  }

  @Get('IDENTIFICATEUR/:id')
  getByIdentificateur(@Param('id') id: string) {
    return this.rebouclageService.findByIdentificateur(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.rebouclageService.delete(id);
  }
  @Get('export')
    async export(@Query('format') format: 'csv' | 'excel', @Res() res: Response) {
    const data = await this.rebouclageService.exportRebouclages(format);
    if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=rebouclages.csv');
        return res.send(data);
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rebouclages.xlsx');
    return res.send(data);
    }
    @Get()
    async findAll(
    @Query('ancien_nni') ancien_nni: string,
    @Query('nouveau_nni') nouveau_nni: string,
    @Query('date_debut') date_debut: string,
    @Query('date_fin') date_fin: string,
    ) {
    return this.rebouclageService.findFiltered({ ancien_nni, nouveau_nni, date_debut, date_fin });
    }

}
