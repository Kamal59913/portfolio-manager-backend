import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; type: string; email: string;schoolId:string }) {
    // Check user existence based on type
    if (payload.type === 'super') {
      const superAdmin = await this.prisma.superAdmin.findUnique({
        where: { id: payload.sub, isActive: true, isDeleted: false },
        include: { role: { include: { permissions: true } } },
      });
      if (!superAdmin) {
        return null; // Will trigger UnauthorizedException in guard
      }

      return {
        id: superAdmin.id,
        email: superAdmin.email,
        type: 'super',
        role: superAdmin.role
          ? {
              name: superAdmin.role.name,
              permissions: superAdmin.role.permissions,
            }
          : null,
      };
    } else {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, isActive: true, isDeleted: false },
        include: { role: { include: { permissions: true } } },
      });
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        email: user.email,
        type: 'user',
        schoolId:user.schoolId,
        
        role: user.role
          ? { name: user.role.name, permissions: user.role.permissions }
          : null,
      };
    }
  }
}
