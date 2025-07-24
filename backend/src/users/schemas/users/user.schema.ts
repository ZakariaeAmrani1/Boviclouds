import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.role';
import { AccountStatus } from './user.acc.status';

export type UserDocument = HydratedDocument<User, UserMethods>;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  CIN: string;

  @Prop({ required: true, unique: true })
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

  @Prop({
    type: [String],
    enum: UserRole,
    default: [],
  })
  role: [UserRole];
  @Prop({ required: false })
  password?: string;

  @Prop({ select: false })
  passwordHash: string;
  @Prop({
    type:String,
    enum:AccountStatus,
    default:AccountStatus.PENDING
  })
  statut:AccountStatus
  @Prop()
  raison_sociale: string
}
export interface UserMethods {
  correctPassword(candidatePassword: string): Promise<boolean>;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    if(this.password){
      const salt = await bcrypt.genSalt(12);
      this.passwordHash = await bcrypt.hash(this.password, salt);
      this.password = undefined
    }
  }
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.pre('save', function (next) {
  this.date_modification = new Date();
  next();
});

UserSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  function (next) {
    this.set({ date_modification: new Date() });
    next();
  },
);
