import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) return null;
    const { password, ...result } = user.toObject ? user.toObject() : user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, role: user.role, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: process.env.JWT_EXPIRES_IN || '3600s',
    };
  }
}
