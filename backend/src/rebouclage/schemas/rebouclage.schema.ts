import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Rebouclage extends Document {
  @Prop({ required: true })
  operation_id: string;

  @Prop({ required: true })
  id_sujet: string;

  @Prop({ required: true })
  ancien_nni: string;

  @Prop({ required: true })
  nouveau_nni: string;

  @Prop({ required: true })
  date_creation: Date;

  @Prop({ type: Types.ObjectId, required: true })
  identificateur_id: Types.ObjectId;
}

export const RebouclageSchema = SchemaFactory.createForClass(Rebouclage);
