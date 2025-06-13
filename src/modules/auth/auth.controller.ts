import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SignInDto,
  AuthResponseDto,
  ProfileResponseDto,
  UpdatePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  GenericAuthResponseDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/core/guards/permissions.guard';
import { Permissions } from 'src/core/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/core/constants/permissions';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ Post('super/signin')
  @ApiOperation({ summary: 'Sign in a super admin' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async superSignIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.superSignin(signInDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signin(signInDto);
  }

  @Post('admin/signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async adminSignIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.adminSignin(signInDto);
  }

  @Post('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getProfile(@Req() req: any): Promise<ProfileResponseDto> {
    const user = req.user;
    return this.authService.getUserDetailsByToken(user.id, user.type);
  }

  @Get('user/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSIONS.user.read.name)
  @ApiOperation({ summary: 'Get school user details by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Missing required permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserDetails(@Param('id') id: string): Promise<ProfileResponseDto> {
    return this.authService.getUserDetails(id);
  }

  @Post('update-password')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PERMISSIONS.auth.change_password.name)
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: GenericAuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid old password or input data',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Missing required permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updatePassword(
    @Req() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<GenericAuthResponseDto> {
    const userId = req.user?.id;
    const isSuperAdmin = req.user?.type === 'super' ? true : false;
    return this.authService.updatePassword(
      userId,
      isSuperAdmin,
      updatePasswordDto,
    );
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent successfully',
    type: GenericAuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<GenericAuthResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: GenericAuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token or input data',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<GenericAuthResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
