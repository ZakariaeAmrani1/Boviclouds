import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly CIN: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly nom_ar?: string;

  @IsString()
  readonly prenom_ar?: string;

  @IsString()
  readonly nom_lat: string;

  @IsString()
  readonly prenom_lat: string;

  @IsString()
  readonly civilite: string;

  @IsString()
  readonly adresse: string;

  @IsString()
  readonly region: string;

  @IsString()
  readonly province: string;

  @IsOptional()
  @IsString()
  readonly raison_sociale?: string; 

  @IsString()
  @IsStrongPassword()
  readonly password:string
}
