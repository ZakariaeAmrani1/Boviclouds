import { Body, Controller, Get, Param, Patch,Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { UpdatePwdDto } from './dtos/update-pwd.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@CurrentUser() user) {
    console.log(user);
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Req() req) {
    return this.usersService.forgotPassword(email, req);
  }
  @UseGuards(JwtAuthGuard)
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: UpdatePwdDto,
  ) {
    return this.usersService.resetPassword(token, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('demande')
  async requestAccount(@Body() dto: CreateUserDto) {
    return this.usersService.requestAccount(dto);
  }
}
