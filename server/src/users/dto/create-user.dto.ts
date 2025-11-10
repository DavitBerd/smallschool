import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'mentor', 'student'])
  role: 'admin' | 'mentor' | 'student';

  @IsOptional()
  @IsArray()
  semesters?: number[];

  @IsOptional()
  missedLectures?: number;

  @IsOptional()
  @IsString()
  group?: string;
}
