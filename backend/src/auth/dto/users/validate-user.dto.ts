import { IsString } from 'class-validator';
import { UserRole } from 'src/users/schemas/users/user.role';

export class ValidateUserDto {
  @IsString()
  readonly role: UserRole;
}
