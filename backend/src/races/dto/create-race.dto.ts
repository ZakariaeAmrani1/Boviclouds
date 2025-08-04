import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRaceDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsOptional()
  @IsString()
  nom_ar?: string;
}
