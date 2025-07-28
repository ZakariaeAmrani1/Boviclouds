import { IsString, IsStrongPassword } from 'class-validator';

export class UpdatePwdDto {
  @IsString()
  @IsStrongPassword()
  readonly password: string;

  @IsString()
  @IsStrongPassword()
  readonly confirmPassword: string;
}