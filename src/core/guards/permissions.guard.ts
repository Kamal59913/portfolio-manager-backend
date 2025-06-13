import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from metadata
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    // If no permissions specified, deny access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      throw new ForbiddenException('No permissions specified for this route');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Ensure user is authenticated and has role/permissions
    if (!user || !user.role || !user.role.permissions) {
      throw new ForbiddenException('User not authenticated or permissions missing');
    }

    // Extract permission names
    const userPermissions = user.role.permissions.map(perm => perm.name);

    // Verify all required permissions are present
    const hasAllPermissions = requiredPermissions.every(perm => userPermissions.includes(perm));

    if (!hasAllPermissions) {
      throw new ForbiddenException(`Missing required permissions: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}