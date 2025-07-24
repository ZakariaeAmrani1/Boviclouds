import { IsDateString, IsMongoId, IsString, Length } from "class-validator";
import { Date } from "mongoose";

export class CreateInseminationDto {
  @IsString()
  @Length(16)
  readonly nni: string;
  @IsDateString()
  readonly date_dissemination: Date;
  @IsMongoId()
  readonly semence_id: string;
  @IsMongoId()
  readonly inseminateur_id: string;
  @IsMongoId()
  readonly responsable_local_id: string;
}
