import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type Role = 'admin' | 'mentor' | 'student';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['admin', 'mentor', 'student'], default: 'student' })
  role: Role;

  @Prop({ type: [Number], default: [0, 0, 0] })
  semesters: number[];

  @Prop({ default: 0 })
  missedLectures: number;

  @Prop({ default: '' })
  group: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
