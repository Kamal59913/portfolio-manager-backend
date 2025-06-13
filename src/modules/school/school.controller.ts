import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto, SchoolResponseDto, SchoolsResponseDto, UpdateSchoolResponseDto, DeleteSchoolResponseDto } from './dto/school.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/core/guards/permissions.guard';
import { Permissions } from 'src/core/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/core/constants/permissions';

@ApiTags('School Management')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller({ path: 'school', version: '1' })
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Permissions(PERMISSIONS.school.create.name)
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({
    status: 201,
    description: 'School created successfully',
    type: SchoolResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data provided' })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing required permissions' })
  @ApiResponse({ status: 409, description: 'School with this registration number or email already exists' })
  @ApiBody({ type: CreateSchoolDto })
  async create(@Body() createSchoolDto: CreateSchoolDto): Promise<SchoolResponseDto> {
    return this.schoolService.createSchool(createSchoolDto);
  }

  @Get()
  @Permissions(PERMISSIONS.school.read.name)
  @ApiOperation({ summary: 'Get all schools' })
  @ApiResponse({
    status: 200,
    description: 'List of schools retrieved successfully',
    type: SchoolsResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing required permissions' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllSchools(): Promise<SchoolsResponseDto> {
    return this.schoolService.getAllSchools();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.school.read_own.name)
  @ApiOperation({ summary: 'Get a school by ID' })
  @ApiParam({ name: 'id', description: 'ID of the school', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'School retrieved successfully',
    type: SchoolResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid user type' })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing required permissions or unauthorized access' })
  @ApiResponse({ status: 404, description: 'School or user not found' })
  async getSingleSchool(@Req() req: any, @Param('id') id: string): Promise<SchoolResponseDto> {
    const userId = req.user?.id;
    const userType = req.user?.type;
    return this.schoolService.getSchoolById(userId, id, userType);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.school.update.name)
  @ApiOperation({ summary: 'Update a school by ID' })
  @ApiParam({ name: 'id', description: 'ID of the school', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'School updated successfully',
    type: UpdateSchoolResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data provided' })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing required permissions' })
  @ApiResponse({ status: 404, description: 'School not found' })
  @ApiResponse({ status: 409, description: 'School with this registration number or email already exists' })
  @ApiBody({ type: UpdateSchoolDto })
  async updateSingleSchool(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto): Promise<UpdateSchoolResponseDto> {
    return this.schoolService.updateSchoolById(id, updateSchoolDto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.school.delete.name)
  @ApiOperation({ summary: 'Delete a school by ID' })
  @ApiParam({ name: 'id', description: 'ID of the school', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'School deleted successfully',
    type: DeleteSchoolResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing required permissions' })
  @ApiResponse({ status: 404, description: 'School not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteSingleSchool(@Param('id') id: string): Promise<DeleteSchoolResponseDto> {
    return this.schoolService.deleteSchoolById(id);
  }
}