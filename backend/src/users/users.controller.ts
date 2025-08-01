import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { UpdatePwdDto } from './dtos/update-pwd.dto';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user) {
    return this.getUser(user.userId);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    console.log('Update User DTO:', updateUserDto);
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Req() req) {
    return this.usersService.forgotPassword(email, req);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: UpdatePwdDto,
  ) {
    return this.usersService.resetPassword(token, dto);
  }

  @Post('demande')
  async requestAccount(@Body() dto: CreateUserDto) {
    return this.usersService.requestAccount(dto);
  }
}
