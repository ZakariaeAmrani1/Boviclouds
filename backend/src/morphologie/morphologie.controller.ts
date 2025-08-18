import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MorphologieService } from './morphologie.service';
import { CreateDetectionMorphologiqueDto } from './dto/create-morphologie.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('api/v1/detection-morphologiques')
@UseGuards(JwtAuthGuard,RolesGuard)
export class MorphologieController {
  
  constructor(private readonly morphologieService: MorphologieService) {}

  @Post()
  async create(@Body() createMorphologieDto: CreateDetectionMorphologiqueDto) {
    return await this.morphologieService.create(createMorphologieDto);
  }

  @Get()
  async findAll() {
    return this.morphologieService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.morphologieService.findOne(id);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.morphologieService.remove(id);
  }
}
