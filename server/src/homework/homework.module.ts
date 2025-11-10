import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Homework, HomeworkSchema } from './schemas/homework.schema';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    UsersModule,
  ],
  providers: [HomeworkService],
  controllers: [HomeworkController],
})
export class HomeworkModule {}
