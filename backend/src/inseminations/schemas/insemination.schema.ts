import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Query } from 'mongoose';
import { UserRole } from 'src/users/schemas/users/user.role';
import { User } from 'src/users/schemas/users/user.schema';

export type InseminationDocument = HydratedDocument<Insemination>;
@Schema({ timestamps: true })
export class Insemination {
  @Prop({ required: true, unique: true, length: 16, maxlength: 16 })
  nni: string;

  @Prop({ required: true, type: Date })
  date_dissemination: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'Semence',
    required: true,
    validate: {
      validator: async function (value: Types.ObjectId) {
        const semence = await this.model('Semence').findById(value);
        return !!semence;
      },
      message: 'Semence not found.',
    },
  })
  semence_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function (value: Types.ObjectId) {
        const user = (await this.model('User').findById(value)) as User;
        return !!user && user.role.includes(UserRole.INSEMINATEUR);
      },
      message: 'Inseminator user not found.',
    },
  })
  inseminateur_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function (value: Types.ObjectId) {
        const user = await this.model('User').findById(value);
        return !!user && user.role.includes(UserRole.RESPONSABLE_LOCAL);
      },
      message: 'Responsable local user not found.',
    },
  })
  responsable_local_id: Types.ObjectId;
}

export const InseminationSchema = SchemaFactory.createForClass(Insemination);

InseminationSchema.pre(/^find/,function(this: Query<any, Insemination>,next){
  this.populate('semence_id')
      .populate('inseminateur_id')
      .populate('responsable_local_id')
  next();
});