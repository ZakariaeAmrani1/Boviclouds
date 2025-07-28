import { Exclude, Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  _id: string;

  @Expose()
  CIN: string;

  @Expose()
  email: string;

  @Expose()
  nom_ar: string;

  @Expose()
  prenom_ar: string;

  @Expose()
  nom_lat: string;

  @Expose()
  prenom_lat: string;

  @Expose()
  civilite: string;

  @Expose()
  adresse: string;

  @Expose()
  region: string;

  @Expose()
  province: string;

  @Expose()
  role: string[];

  @Expose()
  statut: string;

  @Expose()
  raison_sociale: string;

  @Expose()
  date_creation: Date;

  @Expose()
  date_modification: Date;

  @Exclude()
  passwordHash: string;

  @Exclude()
  __v: number;
}
