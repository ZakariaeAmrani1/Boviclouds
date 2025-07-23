import { IsDate, IsMongoId, IsString, Length } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateInseminationDto {
  @IsString()
  @Length(16)
  readonly nni: string;
  @IsDate()
  readonly date_dissemination: Date;
  @IsString()
  readonly nom_taureau: string;
  @IsString()
  readonly race_taureau: string;
  @IsString()
  readonly num_taureau: string;
  @IsMongoId()
  inseminateur_id: ObjectId;
  @IsMongoId()
  responsable_local_id: ObjectId;
}
