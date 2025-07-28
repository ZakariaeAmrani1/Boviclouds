import { Body, Controller, Get, Param, Patch,Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';

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
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('demande')
  async requestAccount(@Body() dto: CreateUserDto) {
    return this.usersService.requestAccount(dto);
  }
}
