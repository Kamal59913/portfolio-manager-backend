import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ResponseMessage('User registered successfully')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signup(dto);
  }

  @Post('signin')
  @ResponseMessage('User signed in successfully')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Get('deleteAll')
  @ResponseMessage('Users deleted successfully')
  delete(@Body() dto: SignInDto) {
    return this.authService.deleteAll();
  }
}
