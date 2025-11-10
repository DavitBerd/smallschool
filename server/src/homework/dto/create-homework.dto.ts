import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsIn,
  Min,
} from 'class-validator';

export class CreateHomeworkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  points: number;

  @IsDateString()
  deadline: string;

  @IsIn(['A1', 'A2', 'B1', 'B2'])
  group: string;

  @IsIn([1, 2, 3])
  semester: 1 | 2 | 3;
}
