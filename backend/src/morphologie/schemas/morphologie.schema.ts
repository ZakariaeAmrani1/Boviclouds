import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false }) 
class Mesure {
  @Prop({ type: Number, required: true })
  valeur: number;

  @Prop({ type: String, required: true,default:'px' })
  unite: string;

}

@Schema({ timestamps: { createdAt: 'timestamp' } })
export class DetectionMorphologique {
  @Prop({ type: Date })
  timestamp: Date;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({
    type: String,
    required: true,
  })
  source_detection: string;

  @Prop({
    type: Mesure,
    required: true,
  })
  hauteur_au_garrot: Mesure;
  @Prop({
    type: Mesure,
    required: true,
  })
  largeur_du_corps: Mesure;
  @Prop({
    type: Mesure,
    required: true,
  })
  longueur_du_corps: Mesure;
}

export type MorphologyDocument = HydratedDocument<DetectionMorphologique>
export const MesureSchema = SchemaFactory.createForClass(Mesure);
export const DetectionMorphologiqueSchema = SchemaFactory.createForClass(
  DetectionMorphologique,
);
