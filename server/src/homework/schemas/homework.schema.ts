import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HomeworkDocument = Homework & Document;

@Schema({ timestamps: true })
export class Homework {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true, enum: [1, 2, 3] })
  semester: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
