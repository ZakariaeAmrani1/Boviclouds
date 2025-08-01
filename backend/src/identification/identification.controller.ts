import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Response } from 'express';
import { UserRole } from 'src/users/schemas/users/user.role';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/v1/identifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @Get('export')
  @Roles(UserRole.IDENTIFICATEUR)
  async exportData(
    @Res() res: Response,
    @Query('format') format: 'csv' | 'excel',
    @Query('nni') nni?: string,
    @Query('date_naissance') date_naissance?: string,
    @Query('race') race?: string,
  ) {
    const buffer = await this.identificationService.export(format, {
      nni,
      date_naissance,
      race,
    });

    const filename = `identifications.${format === 'excel' ? 'xlsx' : 'csv'}`;
    res.setHeader(
      'Content-Type',
      format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(buffer);
  }
  @Post()
  async create(@Body() createDto: CreateIdentificationDto, @Req() req: any) {
    const body = {
      ...createDto,
      createdBy: req.user?.sub, 
    };
    return this.identificationService.create(body);
  }
  @Get()
  async findAll(@Query() query: any) {
    return this.identificationService.findAll(query);
  }

  @Get('filter')
  @Roles(UserRole.IDENTIFICATEUR)
  async filter(
    @Query('nni') nni?: string,
    @Query('date_naissance') date_naissance?: string,
    @Query('race') race?: string,
  ) {
    return this.identificationService.filter({
      nni,
      date_naissance,
      race,
    });
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.IDENTIFICATEUR)
  async deleteIdentification(@Param('id') id: string) {
    return this.identificationService.delete(id);
  }
}
