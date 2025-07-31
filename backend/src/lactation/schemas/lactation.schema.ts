import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query, Types } from 'mongoose';

export type LactationDocument = HydratedDocument<Lactation>;

@Schema({timestamps: { createdAt: 'date_creation', updatedAt: 'date_modification' } })
export class Lactation {
  @Prop({ type: String, required: true }) 
  nni: string;

  @Prop({ type: Date })
  date_velage: Date;

  @Prop({ type: Number })
  n_lactation: number;

  @Prop({ type: Number })
  lait_kg: number;

  @Prop({ type: Number })
  kg_mg: number;

  @Prop({ type: Number })
  pct_proteine: number;

  @Prop({ type: Number })
  pct_mg: number;

  @Prop({ type: Types.ObjectId, ref: 'User' }) 
  controleur_laitier_id: Types.ObjectId;
}

export const LactationSchema = SchemaFactory.createForClass(Lactation);
LactationSchema.pre(/^find/,function(this:Query<any,Lactation>,next){
  this.populate({
    path: 'controleur_laitier_id',
    select: 'CIN name email phone role',
  });
  next();
})