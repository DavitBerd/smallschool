import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createDto: CreateUserDto) {
    const hashed = await bcrypt.hash(createDto.password, 10);
    const user = new this.userModel({
      ...createDto,
      password: hashed,
      semesters: createDto.semesters || [0, 0, 0],
    });
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async updateStudentSemesterSum(
    studentId: string,
    semesterIndex: number,
    addPoints: number,
  ) {
    const user = await this.userModel.findById(studentId);
    if (!user) throw new NotFoundException('Student not found');
    if (!user.semesters || user.semesters.length < 3)
      user.semesters = [0, 0, 0];
    user.semesters[semesterIndex] = Math.min(
      100,
      (user.semesters[semesterIndex] || 0) + addPoints,
    );
    return user.save();
  }

  async incrementMissedLectures(studentId: string, increment = 1) {
    return this.userModel
      .findByIdAndUpdate(
        studentId,
        { $inc: { missedLectures: increment } },
        { new: true },
      )
      .exec();
  }

  async listStudents(group?: string) {
    const filter: any = { role: 'student' };
    if (group) filter.group = group;

    return this.userModel
      .find(filter)
      .select('-password')
      .sort({ group: 1, email: 1 })
      .exec();
  }
}
