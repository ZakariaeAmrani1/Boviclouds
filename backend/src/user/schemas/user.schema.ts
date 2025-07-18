import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User {
  @Prop({ required: true })
  CIN: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  nom_ar: string;

  @Prop()
  prenom_ar: string;

  @Prop()
  nom_lat: string;

  @Prop()
  prenom_lat: string;

  @Prop()
  civilite: string;

  @Prop()
  adresse: string;

  @Prop()
  region: string;

  @Prop()
  province: string;

  @Prop({ default: Date.now })
  date_creation: Date;

  @Prop()
  date_modification: Date;

  @Prop()
  role: string;

  password: string;
  @Prop()
  passwordHash: string;
  @Prop({
    type: Object,
    default: {
      statut: 'en_attente',
      raison_sociale: '',
    },
  })
  metadata: {
    statut: string;
    raison_sociale: string;
  };
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSaltSync(12);
    this.passwordHash = await bcrypt.hash(this.password, salt);
  }
  next();
});
