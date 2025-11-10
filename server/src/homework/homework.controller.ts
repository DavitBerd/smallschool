import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('homeworks')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  constructor(private hwService: HomeworkService) {}

  @Get()
  async list(@Request() req) {
    return this.hwService.listForUser(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles('mentor', 'admin')
  @Post()
  async create(@Body() dto: CreateHomeworkDto, @Request() req) {
    return this.hwService.createHomework(dto, req.user.userId);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.hwService.getById(id);
  }

  @Post(':id/submissions')
  async submit(
    @Param('id') id: string,
    @Body() dto: CreateSubmissionDto,
    @Request() req,
  ) {
    return this.hwService.submitLink(id, req.user.userId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('mentor', 'admin')
  @Get(':id/submissions')
  async submissions(@Param('id') id: string) {
    return this.hwService.listSubmissions(id);
  }

  @UseGuards(RolesGuard)
  @Roles('mentor', 'admin')
  @Patch('submissions/:submissionId/grade')
  async grade(
    @Param('submissionId') submissionId: string,
    @Body('grade') grade: number,
    @Request() req,
  ) {
    return this.hwService.gradeSubmission(submissionId, req.user, grade);
  }
}
