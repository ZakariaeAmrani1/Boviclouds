import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SemencesService } from './semences.service';
import { CreateSemenceDto } from './dto/create-semence.dto';
import { UpdateSemenceDto } from './dto/update-semence.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/users/schemas/users/user.role';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('api/v1/semences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SemencesController {
  constructor(private readonly semencesService: SemencesService) {}

  @Post()
  @Roles(UserRole.RESPONSABLE_LOCAL, UserRole.ADMIN)
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
  @Roles(UserRole.RESPONSABLE_LOCAL, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSemenceDto: UpdateSemenceDto) {
    return this.semencesService.update(id, updateSemenceDto);
  }

  @Delete(':id')
  @Roles(UserRole.RESPONSABLE_LOCAL, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.semencesService.remove(id);
  }
}
