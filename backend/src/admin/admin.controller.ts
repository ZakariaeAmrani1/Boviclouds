import {
  Controller,
  Patch,
  Param,
  NotFoundException,
  Body,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ValidateUserDto } from 'src/auth/dto/users/validate-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/schemas/users/user.role';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateAccForUserDto } from './dtos/create-acc-for-user.dto';
import { Request } from 'express';

@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('validate/:id')
  async requestAccountValidation(
    @Param('id') userId: string,
    @Body()
    dto: ValidateUserDto,
  ) {
    const result = await this.adminService.validateUser(userId, dto);
    if (!result) {
      throw new NotFoundException('User is missing or already approved!');
    }

    return {
      message: 'Account approved successfully',
      user: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('reject/:id')
  async rejectAccountRequest(@Param('id') userId: string) {
    const result = await this.adminService.rejectRequest(userId);
    return {
      message: 'Account request rejected successfully',
      user: result,
    };
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create-account-for-user')
  async createAccountForUser(
    @Body() dto: CreateAccForUserDto,
    @Req() req: Request,
  ) {
    return await this.adminService.createUserAccount(dto,req);
  }
}
