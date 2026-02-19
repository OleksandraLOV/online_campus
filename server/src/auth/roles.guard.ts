import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLE_HIERARCHY } from '../common/types/roles.enum';

export const ROLES_KEY = 'roles';

export function Roles(...roles: Role[]) {
  return (target: any, key?: string | symbol, descriptor?: any) => {
    if (descriptor) {
      Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(ROLES_KEY, roles, target);
    return target;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userRole = user.role as Role;

    // Direct role match
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // Check hierarchy: does userRole inherit any of the required roles?
    const inherited = ROLE_HIERARCHY[userRole] || [];
    return requiredRoles.some((role) => inherited.includes(role));
  }
}
