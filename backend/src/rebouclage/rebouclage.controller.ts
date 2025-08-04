import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../auth/roles.decorator'; 
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RebouclageService } from './rebouclage.service';

import { UserRole } from 'src/users/schemas/users/user.role';
import { CreateRebouclageDto } from './dto/create-rebouclage.dto';



@Controller('api/v1/rebouclages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.IDENTIFICATEUR, UserRole.ADMIN)
export class RebouclageController {
  constructor(private readonly rebouclageService: RebouclageService) {}


  @Post()
  create(@Body() dto: CreateRebouclageDto) {
    return this.rebouclageService.create(dto);
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

