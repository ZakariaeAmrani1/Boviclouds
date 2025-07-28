import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly CIN?: string;
  @IsOptional()

  @IsEmail()
  readonly email?: string;
  @IsOptional()

  @IsString()
  readonly nom_ar?: string;
  @IsOptional()

  @IsString()
  readonly prenom_ar?: string;
  @IsOptional()

  @IsString()
  readonly nom_lat?: string;
  @IsOptional()

  @IsString()
  readonly prenom_lat?: string;
  @IsOptional()

  @IsString()
  readonly civilite?: string;
  @IsOptional()

  @IsString()
  readonly adresse?: string;
  @IsOptional()

  @IsString()
  readonly region?: string;
  @IsOptional()

  @IsString()
  readonly province?: string;
  @IsOptional()

  @IsOptional()
  @IsString()
  readonly raison_sociale?: string;
}
