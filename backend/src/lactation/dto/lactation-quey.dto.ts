import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class LactationQueryDto {
  @IsOptional()
  @IsString()
  nni?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  n_lactation?: number;
  
  @IsOptional()
  @IsDateString()
  date_min?: string;

  @IsOptional()
  @IsDateString()
  date_max?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
