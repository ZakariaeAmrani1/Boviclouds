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

@Controller('api/v1/lactations')
export class LactationController {
  constructor(private readonly lactationService: LactationService) {}

  @UseGuards(JwtAuthGuard)
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
