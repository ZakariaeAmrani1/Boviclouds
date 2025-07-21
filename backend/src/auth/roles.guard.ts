import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from 'src/user/schemas/users/user.role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // inexistence de user ou rôles → interdit
    if (!user || !Array.isArray(user.role)) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }
    const hasRole = user.role.some((r: UserRole) => requiredRoles.includes(r));
    if (!hasRole) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }
    return true;
  }
}
