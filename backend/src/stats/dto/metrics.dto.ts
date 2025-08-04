import { IsNumber, IsNotEmpty } from 'class-validator';

export class MetricsDto {
  @IsNumber()
  @IsNotEmpty()
  totalCattle: number;

  @IsNumber()
  @IsNotEmpty()
  milkProduction: number;

  @IsNumber()
  @IsNotEmpty()
  mortalityRate: number;

  @IsNumber()
  @IsNotEmpty()
  newBirths: number;

  @IsNumber()
  @IsNotEmpty()
  cattleChange: number;

  @IsNumber()
  @IsNotEmpty()
  milkChange: number;

  @IsNumber()
  @IsNotEmpty()
  mortalityChange: number;

  @IsNumber()
  @IsNotEmpty()
  newBirthsChange: number;
}
