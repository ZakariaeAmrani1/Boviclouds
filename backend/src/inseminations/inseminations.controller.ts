import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InseminationsService } from './inseminations.service';
import { CreateInseminationDto } from './dto/create-insemination.dto';
import { UpdateInseminationDto } from './dto/update-insemination.dto';
import { multerMemoryStorage } from 'multer-config';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';

@Controller('api/v1/inseminations')
export class InseminationsController {
  constructor(private readonly inseminationsService: InseminationsService) {}

  @Post()
  create(@Body() createInseminationDto: CreateInseminationDto) {
    return this.inseminationsService.create(createInseminationDto);
  }

  @Get()
  findAll() {
    return this.inseminationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inseminationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInseminationDto: UpdateInseminationDto,
  ) {
    return this.inseminationsService.update(id, updateInseminationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inseminationsService.remove(id);
  }

  @Post('import-inseminations')
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async importInseminations(@UploadedFile() file: MulterFile) {
    await this.inseminationsService.importInseminations(file)
  }
}
