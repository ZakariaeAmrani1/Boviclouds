import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IdentificationDocument = Identification & Document;

@Schema({ timestamps: true })
export class Identification {
  @Prop({
    type: {
      nni: String,
      date_naissance: Date,
      race: String,
      sexe: String,
      type: String,
    },
  })
  infos_sujet: {
    nni: string;
    date_naissance: Date;
    race: string;
    sexe: string;
    type: string;
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
