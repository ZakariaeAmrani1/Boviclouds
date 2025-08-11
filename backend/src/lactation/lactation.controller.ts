import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LactationService } from './lactation.service';
import { CreateLactationDto } from './dto/create-lactation.dto';
import { UpdateLactationDto } from './dto/update-lactation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/schemas/users/user.role';

@Controller('api/v1/lactations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CONTROLEUR_LAITIER, UserRole.ADMIN)
export class LactationController {
  constructor(private readonly lactationService: LactationService) {}

  @Post()
  create(@CurrentUser() user:any, @Body() createLactationDto: CreateLactationDto) {
    return this.lactationService.create(user, createLactationDto);
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
  update(
    @Param('id') id: string,
    @Body() updateLactationDto: UpdateLactationDto,
  ) {
    return this.lactationService.update(id, updateLactationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lactationService.remove(id);
  }
}
