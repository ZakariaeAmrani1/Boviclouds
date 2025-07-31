import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type LactationDocument = HydratedDocument<Lactation>;

@Schema({ timestamps: true })
export class Lactation {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Identification' })
  sujet_id: Types.ObjectId;

  @Prop({ required: true })
  date_velage: Date;

  @Prop({ required: true })
  n_lactation: number;

  @Prop({ required: true })
  lait_kg: number;

  @Prop({ required: true })
  kg_mg: number;

  @Prop({ required: true })
  pct_proteine: number;

  @Prop({ required: true })
  pct_mg: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  controleur_laitier_id: Types.ObjectId;
}

export const LactationSchema = SchemaFactory.createForClass(Lactation);
