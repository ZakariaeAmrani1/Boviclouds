import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type IdentificationDocument = HydratedDocument<Identification>;

@Schema({ timestamps: true })
export class Identification {
  @Prop({
    type: {
      nni: String,
      date_naissance: Date,
      race: String,
      sexe: String,
      type: String,
      photos: {
        type: [String],
        validate: [
          (val: string[]) => val.length <= 5,
          'Maximum 5 photos allowed',
        ],
      },
    },
  })
  infos_sujet: {
    nni: string;
    date_naissance: Date;
    race: string;
    sexe: string;
    type: string;
    photos?: string[];
  };

  @Prop({
    type: {
      nni: String,
      date_naissance: Date,
      race: String,
    },
  })
  infos_mere: {
    nni: string;
    date_naissance: Date;
    race: string;
  };

  @Prop({
    type: {
      nni: String,
      nom: String,
      date_naissance: Date,
      race: String,
    },
  })
  grand_pere_maternel: {
    nni: string;
    nom: string;
    date_naissance: Date;
    race: string;
  };

  @Prop({
    type: {
      nni: String,
      nom: String,
      date_naissance: Date,
      race: String,
    },
  })
  pere: {
    nni: string;
    nom: string;
    date_naissance: Date;
    race: string;
  };

  @Prop({
    type: {
      nni: String,
      nom: String,
      date_naissance: Date,
      race: String,
    },
  })
  grand_pere_paternel: {
    nni: string;
    nom: string;
    date_naissance: Date;
    race: string;
  };

  @Prop({
    type: {
      nni: String,
      date_naissance: Date,
      race: String,
    },
  })
  grand_mere_paternelle: {
    nni: string;
    date_naissance: Date;
    race: string;
  };

  @Prop({
    type: {
      eleveur_id: { type: Types.ObjectId, ref: 'User' },
      exploitation_id: { type: Types.ObjectId, ref: 'Exploitation' },
      responsable_local_id: { type: Types.ObjectId, ref: 'User' },
    },
  })
  complem: {
    eleveur_id: Types.ObjectId;
    exploitation_id: Types.ObjectId;
    responsable_local_id: Types.ObjectId;
  };
}

export const IdentificationSchema = SchemaFactory.createForClass(Identification);
