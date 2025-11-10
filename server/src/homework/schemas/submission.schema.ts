import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Homework', required: true })
  homework: Types.ObjectId;

  @Prop()
  link: string;

  @Prop({ default: 0 })
  grade: number | 0;

  @Prop({ default: false })
  graded: boolean;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
