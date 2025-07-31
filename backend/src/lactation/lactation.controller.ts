import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LactationService } from './lactation.service';
import { CreateLactationDto } from './dto/create-lactation.dto';
import { UpdateLactationDto } from './dto/update-lactation.dto';
import { LactationQueryDto } from './dto/lactation-quey.dto';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/lactations')
export class LactationController {
  constructor(private readonly lactationService: LactationService) {}

  @Post()
  create(
  @CurrentUser() user,
  @Body() createLactationDto: CreateLactationDto
  ) {
    return this.lactationService.create(user,createLactationDto);
  }

  // GET /lactations?date_min=2024-01-01&date_max=2025-01-01&page=1&limit=5
  @Get()
  findAll(
    @Query() query: LactationQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.lactationService.findAll(query, user);
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
