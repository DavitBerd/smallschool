import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new Error('User not found');
    if (!user?._id) throw new Error('User ID missing');

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      group: user.group || null,
    };
  }
}
