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
  async create(@Body() createInseminationDto: CreateInseminationDto) {
    return await this.inseminationsService.create(createInseminationDto);
  }

  @Get()
  async findAll() {
    return await this.inseminationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inseminationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInseminationDto: UpdateInseminationDto,
  ) {
    return await this.inseminationsService.update(id, updateInseminationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.inseminationsService.remove(id);
  }
  @Post('import-inseminations')
  @UseInterceptors(FileInterceptor('file',multerMemoryStorage))
  async importInseminations(@UploadedFile() file: MulterFile) {
    return await this.inseminationsService.importInseminations(file);
  }
}
