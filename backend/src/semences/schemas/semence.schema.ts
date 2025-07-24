import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SimenceDocument = HydratedDocument<Semence>

@Schema({ timestamps: true })
export class Semence {
  @Prop({isRequired:true,unique:true})
  identificateur:string;
  @Prop({ isRequired: true })
  nom_taureau: string;
  @Prop({ isRequired: true })
  race_taureau: string;
  @Prop({isRequired:true})
  num_taureau: string;
}

export const SemenceSchema = SchemaFactory.createForClass(Semence)