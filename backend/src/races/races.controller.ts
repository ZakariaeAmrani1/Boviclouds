import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RacesService } from './races.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/schemas/users/user.role';

@Controller('api/v1/races')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_LOCAL)
  create(@Body() createRaceDto: CreateRaceDto) {
    return this.racesService.create(createRaceDto);
  }

  @Get()
  findAll() {
    return this.racesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.racesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_LOCAL)
  update(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto) {
    return this.racesService.update(id, updateRaceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.RESPONSABLE_LOCAL)
  remove(@Param('id') id: string) {
    return this.racesService.remove(id);
  }
}
