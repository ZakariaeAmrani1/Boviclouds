import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, HydratedDocument } from "mongoose";

export type InseminationDocument = HydratedDocument<Insemination>

@Schema({ timestamps: true })
export class Insemination {
  @Prop({ isRequired: true, unique: true, length:16,maxlength:16 })
  nni: string;
  @Prop({ isRequired: true, type: Date })
  date_dissemination: Date;
  @Prop({ isRequired: true })
  nom_taureau: string;
  @Prop({ isRequired: true })
  race_taureau: string;
  @Prop()
  num_taureau: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  inseminateur_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  responsable_local_id: Types.ObjectId;
}

export const InseminationSchema = SchemaFactory.createForClass(Insemination)