import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSemenceDto {
  @IsString()
  @IsNotEmpty()
  identificateur: string;

  @IsString()
  @IsNotEmpty()
  nom_taureau: string;

  @IsString()
  @IsNotEmpty()
  race_taureau: string;

  @IsString()
  @IsNotEmpty()
  num_taureau: string;
}
