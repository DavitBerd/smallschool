import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Homework, HomeworkDocument } from './schemas/homework.schema';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectModel(Homework.name) private hwModel: Model<HomeworkDocument>,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private usersService: UsersService,
  ) {}

  async createHomework(createDto: CreateHomeworkDto, creatorId: string) {
    const hw = new this.hwModel({
      ...createDto,
      deadline: new Date(createDto.deadline),
      createdBy: creatorId,
    });
    return hw.save();
  }

  async listForUser(user: any) {
    if (user.role === 'student') {
      if (!user.group) {
        throw new BadRequestException('Student has no group assigned');
      }
      return this.hwModel.find({ group: user.group }).exec();
    }

    if (user.role === 'mentor') {
      return this.hwModel.find({ createdBy: user.userId }).exec();
    }

    return this.hwModel.find().exec();
  }

  async getById(id: string) {
    const hw = await this.hwModel.findById(id).exec();
    if (!hw) throw new NotFoundException('Homework not found');
    return hw;
  }

  async submitLink(
    homeworkId: string,
    studentId: string,
    dto: CreateSubmissionDto,
  ) {
    const hw = await this.getById(homeworkId);

    const sub = new this.submissionModel({
      student: studentId,
      homework: homeworkId,
      link: dto.link,
    });
    return sub.save();
  }

  async listSubmissions(homeworkId: string) {
    return this.submissionModel
      .find({ homework: homeworkId })
      .populate('student', '-password')
      .exec();
  }

  async gradeSubmission(submissionId: string, grader: any, gradeValue: number) {
    const sub = await this.submissionModel.findById(submissionId);
    if (!sub) throw new NotFoundException('Submission not found');
    if (sub.graded) throw new BadRequestException('Already graded');
    sub.grade = gradeValue;
    sub.graded = true;
    await sub.save();

    const hw = await this.hwModel.findById(sub.homework);
    if (!hw) throw new NotFoundException('Homework not found');

    const semesterIndex = hw.semester - 1;
    await this.usersService.updateStudentSemesterSum(
      sub.student.toString(),
      semesterIndex,
      gradeValue,
    );

    return sub;
  }
}
