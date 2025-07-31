import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query, Types } from 'mongoose';
import { Identification } from 'src/identification/schemas/identification.schema';
import { UserRole } from 'src/users/schemas/users/user.role';
import { User } from 'src/users/schemas/users/user.schema';

export type LactationDocument = HydratedDocument<Lactation>;

@Schema({ timestamps: true })
export class Lactation {
  @Prop({ 
    type: Types.ObjectId,
    required: true,
    ref: 'Identification', 
    validate:async function (value: Types.ObjectId) {
      const identification = (await this.model('Identification').findById(value)) as Identification;
      return !!identification;
    },
    message: 'Identification not found.',
  })
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

  @Prop({ 
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    validate:async function (value: Types.ObjectId) {
      const user = (await this.model('User').findById(value)) as User;
      return !!user && user.role.includes(UserRole.CONTROLEUR_LAITIER);
    },
    message: 'Controleur laitier not found.', 
  })
  controleur_laitier_id: Types.ObjectId;
}

export const LactationSchema = SchemaFactory.createForClass(Lactation);

LactationSchema.pre(/^find/, function (this: Query<any, Lactation>, next) {
  this.populate({
    path: 'controleur_laitier_id',
    select: 'CIN name email phone role',
  }).populate({
    path: 'sujet_id',
    select: 'infos_sujet',
  });
  next();
});
