import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const u = user.toObject();
    delete (u as Partial<any>).password;
    return u;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return null;
    const u = user.toObject();
    delete (u as Partial<any>).password;
    return u;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mentor')
  @Get('students')
  async getStudents(@Query('group') group?: string) {
    return this.usersService.listStudents(group);
  }
}
