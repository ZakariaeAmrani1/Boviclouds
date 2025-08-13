// identification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from 'src/users/schemas/users/user.role';

// ----- Sous-schemas -----

@Schema({_id:false})
export class InfosSujet {
  @Prop({ required: true }) nni: string;
  @Prop() date_naissance: Date;
  @Prop() race: string;
  @Prop() sexe: string;
  @Prop() type: string;

  @Prop({
    type: [String],
    validate: [(val: string[]) => val.length <= 5, 'Maximum 5 photos allowed'],
  })
  photos?: string[];
}
export const InfosSujetSchema = SchemaFactory.createForClass(InfosSujet);

@Schema({ _id: false })
export class InfosMere {
  @Prop({ required: true }) nni: string;
  @Prop() date_naissance: Date;
  @Prop() race: string;
}
export const InfosMereSchema = SchemaFactory.createForClass(InfosMere);

@Schema({ _id: false })
export class AnimalParent {
  @Prop({ required: true }) nni: string;
  @Prop() nom: string;
  @Prop() date_naissance: Date;
  @Prop() race: string;
}
export const AnimalParentSchema = SchemaFactory.createForClass(AnimalParent);

@Schema({ _id: false })
export class GrandMere {
  @Prop({ required: true }) nni: string;
  @Prop() date_naissance: Date;
  @Prop() race: string;
}
export const GrandMereSchema = SchemaFactory.createForClass(GrandMere);

@Schema({ _id: false })
export class ComplementIds {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  eleveur_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exploitation' })
  exploitation_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  responsable_local_id: Types.ObjectId;
}
export const ComplementIdsSchema = SchemaFactory.createForClass(ComplementIds);

// ----- Schéma principal -----

export type IdentificationDocument = HydratedDocument<Identification>;

@Schema({ timestamps: true })
export class Identification {
  @Prop({ type: InfosSujetSchema, required: true })
  infos_sujet: InfosSujet;

  @Prop({ type: InfosMereSchema })
  infos_mere: InfosMere;

  @Prop({ type: AnimalParentSchema })
  grand_pere_maternel: AnimalParent;

  @Prop({ type: AnimalParentSchema })
  pere: AnimalParent;

  @Prop({ type: AnimalParentSchema })
  grand_pere_paternel: AnimalParent;

  @Prop({ type: GrandMereSchema })
  grand_mere_paternelle: GrandMere;

  @Prop({ type: ComplementIdsSchema })
  complem: ComplementIds;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (value: Types.ObjectId) {
        const user = await this.model('User').findById(value);
        return (
          !!user &&
          (user.role.includes(UserRole.IDENTIFICATEUR) ||
            user.role.includes(UserRole.ADMIN))
        );
      },
      message: 'Identificateur or admin user not found.',
    },
  })
  createdBy: Types.ObjectId;
}

export const IdentificationSchema =
  SchemaFactory.createForClass(Identification);
