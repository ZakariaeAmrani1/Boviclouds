import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SemencesService } from './semences.service';
import { CreateSemenceDto } from './dto/create-semence.dto';
import { UpdateSemenceDto } from './dto/update-semence.dto';

@Controller('api/v1/semences')
export class SemencesController {
  constructor(private readonly semencesService: SemencesService) {}

  @Post()
  create(@Body() createSemenceDto: CreateSemenceDto) {
    return this.semencesService.create(createSemenceDto);
  }

  @Get()
  findAll() {
    return this.semencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semencesService.findOne(id);
  }
  @Get(':identificator')
  findByIdentificator(@Param('identificator') identificator: string) {
    return this.semencesService.findByIdentificator(identificator);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSemenceDto: UpdateSemenceDto) {
    return this.semencesService.update(id, updateSemenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semencesService.remove(id);
  }
}
