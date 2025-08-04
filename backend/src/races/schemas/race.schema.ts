import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RaceDocument = HydratedDocument<Race>;

@Schema({ timestamps: { createdAt: 'date_creation' ,updatedAt:'date_modification'} })
export class Race {
  @Prop({ type: String, required: true })
  nom: string;

  @Prop({ type: String })
  nom_ar: string;

  @Prop({ type: Date })
  date_creation: Date;
  @Prop({ type: Date })
  date_modification: Date;
}

export const RaceSchema = SchemaFactory.createForClass(Race);

