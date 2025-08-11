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
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { UpdatePwdDto } from './dtos/update-pwd.dto';
import { ChangePwdDto } from './dtos/change-pwd.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './schemas/users/user.role';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user) {
    return this.getUser(user.userId);
  }

  @Patch('change-password')
  async changePassword(
    @CurrentUser() user,
    @Body() changePwdDto: ChangePwdDto,
  ) {
    return this.usersService.updatePassword(user.userId, changePwdDto);
  }
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    console.log('Update User DTO:', updateUserDto);
    return await this.usersService.updateUser(id, updateUserDto);
  }
  @Roles(UserRole.ADMIN)
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
