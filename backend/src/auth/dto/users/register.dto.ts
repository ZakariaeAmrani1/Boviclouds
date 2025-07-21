import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  CIN: string;

  @IsEmail()
  email: string;

  @IsString()
  nom_ar: string;

  @IsString()
  prenom_ar: string;

  @IsString()
  nom_lat: string;

  @IsString()
  prenom_lat: string;

  @IsString()
  civilite: string;

  @IsString()
  adresse: string;

  @IsString()
  region: string;

  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  raison_sociale?: string; 

  @IsString()
  @IsStrongPassword()
  password:string
}
