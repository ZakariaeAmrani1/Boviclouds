import { Controller, Post, Body, Req, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dto/users/register.dto';
import { LoginDto } from './dto/users/login.dto';
import { Request } from 'express';
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto, @Req() req: Request) {
    return this.authService.register(dto, req);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch('confirm-email/:token')
  async confirmeEmail(@Param('token') token:string){
    return await this.authService.confirmEmail(token);
  }
  @Post('resend-verification-email')
  async resendVerificationEmail(
    @Body('email') email: string,
    @Req() req: Request,
  ) {
    return this.authService.resendVerificationEmail(email, req);
  }
}
