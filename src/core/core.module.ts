import { Global, Module } from '@nestjs/common';
import { PermissionGuard } from './guards/permissions.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FileCleanupService } from './services/fileCleanup.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') ?? '24h',
        },
      }),
    }),
  ],
  providers: [
    JwtAuthGuard,
    PermissionGuard,
    JwtStrategy,
    FileCleanupService
  ],
  exports: [
    JwtAuthGuard,
    PermissionGuard,
    JwtStrategy,
    JwtModule,
    PassportModule,
    FileCleanupService
  ],
})
export class CoreModule {}
