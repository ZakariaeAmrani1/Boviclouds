import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { InseminationsService } from './inseminations.service';
import { CreateInseminationDto } from './dto/create-insemination.dto';
import { UpdateInseminationDto } from './dto/update-insemination.dto';
import { multerMemoryStorage } from 'multer-config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/schemas/users/user.role';
import { Roles } from 'src/auth/roles.decorator';

@Controller('api/v1/inseminations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INSEMINATEUR, UserRole.ADMIN)
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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async importInseminations(@UploadedFile() file: Express.Multer.File) {
    return await this.inseminationsService.importInseminations(file);
  }
}
