import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { AccountStatus } from 'src/users/schemas/users/user.acc.status';
import { UserRole } from 'src/users/schemas/users/user.role';

export class CreateAccForUserDto {
  @IsString({ message: 'CIN must be a string' })
  readonly CIN: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString({ message: 'Nom arabe must be a string' })
  readonly nom_ar?: string;
  @IsOptional()
  @IsString({ message: 'Prenom arabe must be a string' })
  readonly prenom_ar?: string;

  @IsString()
  readonly nom_lat: string;

  @IsString()
  readonly prenom_lat: string;

  @IsString()
  readonly role: UserRole;

  @IsString()
  readonly status: AccountStatus;

  @IsString()
  readonly civilite: string;

  @IsString()
  readonly adresse: string;

  @IsString()
  readonly region: string;

  @IsString()
  readonly province: string;

  @IsString()
  @IsPhoneNumber('MA')
  @Length(10, 14)
  readonly telephone: string;

  @IsOptional()
  @IsString()
  readonly raison_sociale?: string;
}
