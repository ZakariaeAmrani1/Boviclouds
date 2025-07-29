import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/users/schemas/users/user.role';
import { User } from 'src/users/schemas/users/user.schema';

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
  identificateur_id: Types.ObjectId;
}

export const RebouclageSchema = SchemaFactory.createForClass(Rebouclage);
