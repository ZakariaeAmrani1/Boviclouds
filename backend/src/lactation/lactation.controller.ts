import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LactationService } from './lactation.service';
import { CreateLactationDto } from './dto/create-lactation.dto';
import { UpdateLactationDto } from './dto/update-lactation.dto';

@Controller('api/v1/lactations')
export class LactationController {
  constructor(private readonly lactationService: LactationService) {}

  @Post()
  create(@Body() createLactationDto: CreateLactationDto) {
    return this.lactationService.create(createLactationDto);
  }

  @Get()
  findAll() {
    return this.lactationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lactationService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLactationDto: UpdateLactationDto) {
    return this.lactationService.update(id, updateLactationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lactationService.remove(id);
  }
}
