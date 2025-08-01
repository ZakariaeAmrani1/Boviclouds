import { IsString, IsStrongPassword } from 'class-validator';

export class ChangePwdDto {
  @IsString()
  readonly currentPassword: string;
  
  @IsString()
  @IsStrongPassword()
  readonly password: string;

  @IsString()
  @IsStrongPassword()
  readonly confirmPassword: string;
}