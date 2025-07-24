import { IsDate, IsDateString, IsMongoId, IsString, Length } from "class-validator";
import { Date, DateToString, ObjectId } from "mongoose";

export class CreateInseminationDto {
  @IsString()
  @Length(16)
  readonly nni: string;
  @IsDateString()
  readonly date_dissemination: Date;
  @IsString()
  readonly nom_taureau: string;
  @IsString()
  readonly race_taureau: string;
  @IsString()
  readonly num_taureau: string;
  @IsMongoId()
  readonly inseminateur_id: string;
  @IsMongoId()
  readonly responsable_local_id: string;
}
