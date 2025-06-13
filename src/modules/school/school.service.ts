import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import {
  CreateSchoolDto,
  UpdateSchoolDto,
  SchoolResponseDto,
  SchoolsResponseDto,
  UpdateSchoolResponseDto,
  DeleteSchoolResponseDto,
} from './dto/school.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}

  async createSchool(
    createSchoolDto: CreateSchoolDto,
  ): Promise<SchoolResponseDto> {
    const {
      registrationNumber,
      email,
      website,
      name,
      address,
      phone,
      establishedYear,
    } = createSchoolDto;

    // Check for existing school by registrationNumber
    const existingSchool = await this.prisma.school.findFirst({
      where: { registrationNumber: registrationNumber.trim() },
    });
    if (existingSchool) {
      throw new HttpException(
        'School with this registration number already exists',
        HttpStatus.CONFLICT,
      );
    }

    // Create school
    const school = await this.prisma.school.create({
      data: {
        registrationNumber: registrationNumber.trim(),
        email: email?.trim().toLowerCase(),
        website,
        name: name.trim(),
        address,
        phone: phone?.trim(),
        establishedYear,
      },
    });

    return {
      message: 'School created successfully',
      school: {
        id: school.id,
        registrationNumber: school.registrationNumber,
        email: school.email ?? undefined,
        website: school.website ?? undefined,
        name: school.name,
        address: school.address ?? undefined,
        phone: school.phone ?? undefined,
        establishedYear: school.establishedYear ?? undefined,
        createdAt: school.createdAt.toISOString(),
        updatedAt: school.updatedAt.toISOString(),
      },
    };
  }

  async getAllSchools(): Promise<SchoolsResponseDto> {
    const schools = await this.prisma.school.findMany({
      where: {
        isDeleted: false,
      },
    });
  
    return {
      message: 'List of schools retrieved successfully',
      schools: schools.map((school) => ({
        id: school.id,
        registrationNumber: school.registrationNumber,
        email: school.email ?? undefined,
        website: school.website ?? undefined,
        name: school.name,
        address: school.address ?? undefined,
        phone: school.phone ?? undefined,
        establishedYear: school.establishedYear ?? undefined,
        createdAt: school.createdAt.toISOString(),
        updatedAt: school.updatedAt.toISOString(),
      })),
    };
  }
  

  async getSchoolById(
    userId: string,
    id: string,
    userType: string,
  ): Promise<SchoolResponseDto> {
    // Validate userType
    if (!['super', 'user'].includes(userType)) {
      throw new HttpException('Invalid user type', HttpStatus.BAD_REQUEST);
    }

    // Fetch school
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
      throw new HttpException('School not found', HttpStatus.NOT_FOUND);
    }

    // Super admin can access any school
    if (userType === 'super') {
      return {
        message: 'School retrieved successfully',
        school: {
          id: school.id,
          registrationNumber: school.registrationNumber,
          email: school.email ?? undefined,
          website: school.website ?? undefined,
          name: school.name,
          address: school.address ?? undefined,
          phone: school.phone ?? undefined,
          establishedYear: school.establishedYear ?? undefined,
          createdAt: school.createdAt.toISOString(),
          updatedAt: school.updatedAt.toISOString(),
        },
      };
    }

    // Check user-school association for non-super users
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { schoolId: true },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.schoolId !== id) {
      throw new HttpException(
        'Unauthorized to access this school',
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      message: 'School retrieved successfully',
      school: {
        id: school.id,
        registrationNumber: school.registrationNumber,
        email: school.email ?? undefined,
        website: school.website ?? undefined,
        name: school.name,
        address: school.address ?? undefined,
        phone: school.phone ?? undefined,
        establishedYear: school.establishedYear ?? undefined,
        createdAt: school.createdAt.toISOString(),
        updatedAt: school.updatedAt.toISOString(),
      },
    };
  }

  async updateSchoolById(
    id: string,
    updateSchoolDto: UpdateSchoolDto,
  ): Promise<UpdateSchoolResponseDto> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
      throw new HttpException('School not found', HttpStatus.NOT_FOUND);
    }

    // Check for registrationNumber conflict if updating
    if (updateSchoolDto.registrationNumber) {
      const existingSchool = await this.prisma.school.findFirst({
        where: {
          registrationNumber: updateSchoolDto.registrationNumber.trim(),
          id: { not: id },
        },
      });
      if (existingSchool) {
        throw new HttpException(
          'School with this registration number already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updatedSchool = await this.prisma.school.update({
      where: { id },
      data: {
        registrationNumber: updateSchoolDto.registrationNumber?.trim(),
        email: updateSchoolDto.email?.trim().toLowerCase(),
        website: updateSchoolDto.website,
        name: updateSchoolDto.name?.trim(),
        address: updateSchoolDto.address,
        phone: updateSchoolDto.phone?.trim(),
        establishedYear: updateSchoolDto.establishedYear,
      },
    });

    return {
      message: 'School updated successfully',
      school: {
        id: updatedSchool.id,
        registrationNumber: updatedSchool.registrationNumber,
        email: updatedSchool.email ?? undefined,
        website: updatedSchool.website ?? undefined,
        name: updatedSchool.name,
        address: updatedSchool.address ?? undefined,
        phone: updatedSchool.phone ?? undefined,
        establishedYear: updatedSchool.establishedYear ?? undefined,
        createdAt: updatedSchool.createdAt.toISOString(),
        updatedAt: updatedSchool.updatedAt.toISOString(),
      },
    };
  }

  async deleteSchoolById(id: string): Promise<DeleteSchoolResponseDto> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
      throw new HttpException('School not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.school.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { message: 'School deleted successfully' };
  }
}
