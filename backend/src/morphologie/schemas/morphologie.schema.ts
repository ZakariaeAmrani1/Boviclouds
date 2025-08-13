import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false }) 
class Mesure {
  @Prop({ type: Number, required: true })
  valeur: number;

  @Prop({ type: String, required: true, default:'px'})
  unite: string;
}

export type DetectionMorphologiqueDocument = HydratedDocument<DetectionMorphologique>;

@Schema({ timestamps: { createdAt: 'timestamp' } })
export class DetectionMorphologique {
  @Prop({ type: Date, required: true })
  timestamp: Date;

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
  hauteur_au_garrot: Mesure;
  largeur_du_corps: Mesure;
  longueur_du_corps: Mesure;
}

export const MesureSchema = SchemaFactory.createForClass(Mesure);
export const DetectionMorphologiqueSchema = SchemaFactory.createForClass(
  DetectionMorphologique,
);
