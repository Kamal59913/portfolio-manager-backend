import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async signup(data: SignUpDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {email: data.email}
    });
    if(userExists) throw new ConflictException('Email already in use');
    const hash = await bcrypt.hash(data.password, 10)

    const user = await this.prisma.user.create({
      data: { email: data.email, password: hash},
    })

    return {
      token: this.generateToken(user),
      userId: user.id,
    };
  }

  async signin(data: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {email: data.email}
    })

    if(!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.generateToken(user),
      userId: user.id,
    };
  }

  async deleteAll() {
    const { count } = await this.prisma.user.deleteMany();
    return { deletedCount: count };
  }


  private generateToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET || '234', expiresIn: '1d' },
    );
  }
}
