import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false }) 
class Mesure {
  @Prop({ type: Number, required: true })
  valeur: number;

  @Prop({ type: String, required: true })
  unite: string;

  @Prop({ type: Number, required: false })
  confiance?: number;

  @Prop({ type: String, required: false })
  etat?: string;

  @Prop({ type: String, required: false })
  notes?: string;
}

export type DetectionMorphologiqueDocument = HydratedDocument<DetectionMorphologique>;

@Schema()
export class DetectionMorphologique {
  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({
    type: String,
    enum: ['vision_camera', '3d_scanner', 'manual_input'],
    required: true,
  })
  source_detection: string;

  @Prop({
    type: {
      hauteur_au_garrot: { type: Mesure },
      largeur_du_corps: { type: Mesure },
      longueur_du_corps: { type: Mesure },
    },
    required: true,
  })
  donnees_morphologiques: {
    hauteur_au_garrot: Mesure;
    largeur_du_corps: Mesure;
    longueur_du_corps: Mesure;
  };
}

export const MesureSchema = SchemaFactory.createForClass(Mesure);
export const DetectionMorphologiqueSchema = SchemaFactory.createForClass(
  DetectionMorphologique,
);
