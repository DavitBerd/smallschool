import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'student') {
      const { password, ...safeUser } = user.toObject();
      return safeUser;
    }

    return { email: user.email, role: user.role };
  }
}
