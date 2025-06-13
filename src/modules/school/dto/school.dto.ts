import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, MaxLength, IsInt, Min } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({
    description: 'Unique registration number of the school',
    example: 'SCH123456',
  })
  @IsString({ message: 'Registration number must be a string' })
  @IsNotEmpty({ message: 'Registration number is required' })
  @MaxLength(50, { message: 'Registration number must not exceed 50 characters' })
  registrationNumber: string;

  @ApiProperty({
    description: 'Email address of the school',
    example: 'school@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'Website of the school',
    example: 'https://school.example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Website must be a string' })
  website?: string;

  @ApiProperty({
    description: 'Name of the school',
    example: 'Example High School',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Address of the school',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiProperty({
    description: 'Phone number of the school',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    description: 'Year the school was established',
    example: 1990,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Established year must be an integer' })
  @Min(1800, { message: 'Established year must be 1800 or later' })
  establishedYear?: number;
}

export class UpdateSchoolDto {
  @ApiProperty({
    description: 'Updated registration number of the school',
    example: 'SCH123457',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Registration number must be a string' })
  @MaxLength(50, { message: 'Registration number must not exceed 50 characters' })
  registrationNumber?: string;

  @ApiProperty({
    description: 'Updated email address of the school',
    example: 'newschool@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'Updated website of the school',
    example: 'https://newschool.example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Website must be a string' })
  website?: string;

  @ApiProperty({
    description: 'Updated name of the school',
    example: 'New Example High School',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Updated address of the school',
    example: '456 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiProperty({
    description: 'Updated phone number of the school',
    example: '+0987654321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    description: 'Updated year the school was established',
    example: 2000,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Established year must be an integer' })
  @Min(1800, { message: 'Established year must be 1800 or later' })
  establishedYear?: number;
}

export class SchoolResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'School created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Details of the school',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      registrationNumber: { type: 'string', example: 'SCH123456' },
      email: { type: 'string', example: 'school@example.com', nullable: true },
      website: { type: 'string', example: 'https://school.example.com', nullable: true },
      name: { type: 'string', example: 'Example High School' },
      address: { type: 'string', example: '123 Main St, City, Country', nullable: true },
      phone: { type: 'string', example: '+1234567890', nullable: true },
      establishedYear: { type: 'number', example: 1990, nullable: true },
      createdAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
    },
  })
  school: {
    id: string;
    registrationNumber: string;
    email?: string;
    website?: string;
    name: string;
    address?: string;
    phone?: string;
    establishedYear?: number;
    createdAt: string;
    updatedAt: string;
  };
}

export class SchoolsResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'List of schools retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of schools',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        registrationNumber: { type: 'string', example: 'SCH123456' },
        email: { type: 'string', example: 'school@example.com', nullable: true },
        website: { type: 'string', example: 'https://school.example.com', nullable: true },
        name: { type: 'string', example: 'Example High School' },
        address: { type: 'string', example: '123 Main St, City, Country', nullable: true },
        phone: { type: 'string', example: '+1234567890', nullable: true },
        establishedYear: { type: 'number', example: 1990, nullable: true },
        createdAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      },
    },
  })
  schools: Array<{
    id: string;
    registrationNumber: string;
    email?: string;
    website?: string;
    name: string;
    address?: string;
    phone?: string;
    establishedYear?: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export class UpdateSchoolResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'School updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Details of the updated school',
    type: 'object',
    properties: {
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      registrationNumber: { type: 'string', example: 'SCH123456' },
      email: { type: 'string', example: 'school@example.com', nullable: true },
      website: { type: 'string', example: 'https://school.example.com', nullable: true },
      name: { type: 'string', example: 'Example High School' },
      address: { type: 'string', example: '123 Main St, City, Country', nullable: true },
      phone: { type: 'string', example: '+1234567890', nullable: true },
      establishedYear: { type: 'number', example: 1990, nullable: true },
      createdAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
    },
  })
  school: {
    id: string;
    registrationNumber: string;
    email?: string;
    website?: string;
    name: string;
    address?: string;
    phone?: string;
    establishedYear?: number;
    createdAt: string;
    updatedAt: string;
  };
}

export class DeleteSchoolResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'School deleted successfully',
  })
  message: string;
}