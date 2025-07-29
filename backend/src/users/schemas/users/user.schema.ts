import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.role';
import { AccountStatus } from './user.acc.status';
import * as crypto from "crypto";

export type UserDocument = HydratedDocument<User, UserMethods>;
@Schema()
export class User {
  @Prop({ required: true,unique: true })
  CIN: string;

  @Prop({ required: true,unique: true })
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

  @Prop()
  telephone: string;
  
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

  @Prop()
  password?: string;

  @Prop({ select: false })
  passwordHash: string;

  @Prop({
    type: String,
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  statut: AccountStatus;
  @Prop()
  raison_sociale: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailValToken?: string;

  @Prop()
  emailTokenExpires?: number;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetTokenExpires?: number;
}
export interface UserMethods {
  correctPassword(candidatePassword: string): Promise<boolean>;
  CreateEmailValiationToken(): string;
  createPasswordResetToken(): string;
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

UserSchema.methods.CreateEmailValiationToken = function ():string {
  const emailValToken = crypto.randomBytes(32).toString('hex');
  this.emailValToken = crypto
    .createHash('sha256')
    .update(emailValToken)
    .digest('hex');
  this.emailTokenExpires = Date.now() + 10 * 60 * 1000;
  return emailValToken;
};

UserSchema.methods.createPasswordResetToken = function (): string {
  const passwordResetToken = crypto.randomBytes(32).toString('hex');
  this.emailValToken = crypto
    .createHash('sha256')
    .update(passwordResetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return passwordResetToken;
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

