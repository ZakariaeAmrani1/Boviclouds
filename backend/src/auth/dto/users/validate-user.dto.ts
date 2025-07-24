import { IsString } from 'class-validator';
import { UserRole } from 'src/user/schemas/users/user.role';

export class ValidateUserDto {
  @IsString()
  readonly role: UserRole;
}
