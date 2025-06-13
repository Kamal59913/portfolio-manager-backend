import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email address of the user or super admin',
    example: 'superadmin@admin.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'SecurePassword123!',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Sign-in successful',
  })
  message: string;

  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6InVzZXIiLCJpYXQiOjE3NDQ2MTQwNzQsImV4cCI6MTc0NDYxNzY3NH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;

  @ApiProperty({
    description: 'User or super admin details',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      isActive: { type: 'boolean', example: true },
      isDeleted: { type: 'boolean', example: false },
      createdAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      type: { type: 'string', example: 'user' },
      role: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
          name: { type: 'string', example: 'admin' },
        },
        nullable: true,
      },
    },
  })
  data: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    type: 'super' | 'user';
    role?: { id: string; name: string };
  };
}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User details retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User or super admin details',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      isActive: { type: 'boolean', example: true },
      isDeleted: { type: 'boolean', example: false },
      createdAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      type: { type: 'string', example: 'user' },
      role: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
          name: { type: 'string', example: 'admin' },
        },
        nullable: true,
      },
      school: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
          name: { type: 'string', example: 'admin' },
        },
        nullable: true
      }
    },
  })
  data: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    type: 'super' | 'user';
    role?: { id: string; name: string };
    school?: { id: string; name: string }
  };
}


export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'OldPassword123!',
  })
  @IsString({ message: 'Old password must be a string' })
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'NewPassword123!',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting a password reset',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token sent to the user',
    example: 'abc123xyz789',
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'NewPassword123!',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}

export class GenericAuthResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password updated successfully',
  })
  message: string;
}