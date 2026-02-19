import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../common/types/roles.enum';
export declare const ROLES_KEY = "roles";
export declare function Roles(...roles: Role[]): (target: any, key?: string | symbol, descriptor?: any) => any;
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
