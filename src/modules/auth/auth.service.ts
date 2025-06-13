import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/shared/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  SignInDto,
  AuthResponseDto,
  ProfileResponseDto,
  UpdatePasswordDto,
  GenericAuthResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import * as crypto from 'crypto';
import { MailTriggerService } from 'src/mail/mail-trigger.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailTriggerService: MailTriggerService,
  ) {}

  async superSignin(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;
    const user = await this.prisma.superAdmin.findFirst({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account suspended');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      type: 'super' as const,
    };

    const token = this.generateToken(userData.id, userData.type);
    return { message: 'Sign-in successful', token, data: userData };
  }

  async adminSignin(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });

    const super_user = await this.prisma.superAdmin.findFirst({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user?.role?.name != 'admin') {
      throw new UnauthorizedException('Invalid credentials');
    }

    if(super_user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account suspended');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      type: 'user' as const,
      role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
    };

    const token = this.generateToken(userData.id, userData.type);
    return { message: 'Sign-in successful', token, data: userData };
  }

  async signin(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account suspended');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      type: 'user' as const,
      role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
    };

    const token = this.generateToken(userData.id, userData.type);
    return { message: 'Sign-in successful', token, data: userData };
  }


  async getUserDetailsByToken(
    userId: string,
    userType: 'super' | 'user',
  ): Promise<ProfileResponseDto> {
    if (userType === 'super') {
      const superAdmin = await this.prisma.superAdmin.findUnique({
        where: { id: userId },
      });
      if (!superAdmin) {
        throw new NotFoundException('Super admin not found');
      }
      return {
        message: 'User details retrieved successfully',
        data: {
          id: superAdmin.id,
          email: superAdmin.email,
          name: superAdmin.name,
          isActive: superAdmin.isActive,
          isDeleted: superAdmin.isDeleted,
          createdAt: superAdmin.createdAt.toISOString(),
          updatedAt: superAdmin.updatedAt.toISOString(),
          type: 'super',
        },
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, school: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User details retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        type: 'user',
        role: user.role
          ? { id: user.role.id, name: user.role.name }
          : undefined,
        school: user.school
          ? { id: user.school.id, name: user.school.name }
          : undefined,
      },
    };
  }

  async getUserDetails(userId: string): Promise<ProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, school: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User details retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        type: 'user',
        role: user.role
          ? { id: user.role.id, name: user.role.name }
          : undefined,

        school: user.school
          ? { id: user.school.id, name: user.school.name }
          : undefined,
      },
    };
  }

  async updatePassword(
    userId: string,
    isSuperAdmin: boolean,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<GenericAuthResponseDto> {
    const { oldPassword, newPassword } = updatePasswordDto;
    // Fetch user or super admin
    const entity = isSuperAdmin
      ? await this.prisma.superAdmin.findUnique({ where: { id: userId } })
      : await this.prisma.user.findUnique({ where: { id: userId } });

    if (!entity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, entity.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    if (isSuperAdmin) {
      await this.prisma.superAdmin.update({
        where: { id: userId },
        data: { password: hashedPassword, updatedAt: new Date() },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword, updatedAt: new Date() },
      });
    }

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<GenericAuthResponseDto> {
    const { email } = forgotPasswordDto;

    // Check if email exists in User or SuperAdmin
    const user = await this.prisma.user.findUnique({ where: { email } });
    const superAdmin = await this.prisma.superAdmin.findUnique({
      where: { email },
    });

    if (!user && !superAdmin) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour expiry
    let name = '';
    // Update reset token and expiry
    if (user) {
      await this.prisma.user.update({
        where: { email },
        data: {
          resetPasswordToken: token,
          resetPasswordExpires: expires,
        },
      });
      name = user.name;
    } else {
      await this.prisma.superAdmin.update({
        where: { email },
        data: {
          resetPasswordToken: token,
          resetPasswordExpires: expires,
        },
      });
      name = <string>superAdmin?.name;
    }

    const resetUrl = `${this.configService.get<string>('WEB_URL')}reset-password?token=${token}`;
    try {
      const emailResponse = await this.mailTriggerService.trigger(
        'forgot-password',
        {
          to: email,
          context: {
            name,
            resetUrl,
            year: new Date().getFullYear(),
          },
        },
      );
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new HttpException(
        'Failed to send password reset email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Password reset link sent successfully' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<GenericAuthResponseDto> {
    const { token, newPassword } = resetPasswordDto;

    // Check for user or super admin with valid token
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    const superAdmin = await this.prisma.superAdmin.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user && !superAdmin) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.superAdmin.update({
        where: { id: superAdmin?.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          updatedAt: new Date(),
        },
      });
    }

    return { message: 'Password reset successfully' };
  }

  
  private generateToken(userId: string, type: 'super' | 'user'): string{

    const payload = { sub: userId, type };
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
    return this.jwtService.sign(payload, { secret, expiresIn });
  }
}
