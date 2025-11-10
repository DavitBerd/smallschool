import { Controller, Get, Patch, Query, UseGuards, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private usersService: UsersService) {}

  @Roles('mentor', 'admin')
  @Get()
  async getStudents(@Query('group') group: string) {
    const all = await this.usersService.findAll();
    return all.filter((u) => u.role === 'student' && u.group === group);
  }

  @Roles('mentor', 'admin')
  @Patch()
  async markAttendance(@Body() body: { studentId: string; present: boolean }) {
    const { studentId, present } = body;

    const student = await this.usersService.findById(studentId);
    if (!student) throw new Error('Student not found');

    const increment = present ? -1 : 1;
    const missed = Math.max(0, student.missedLectures + increment);
    student.missedLectures = missed;
    await student.save();

    return { studentId, missedLectures: missed };
  }
}
