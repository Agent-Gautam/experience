import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../enums/task-status.enum.js';
import { TaskTimedness } from '../enums/task-timedness.enum.js';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Duration must be a positive number' })
  readonly duration?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @IsEnum(TaskTimedness)
  @IsOptional()
  readonly timedness?: TaskTimedness;

  // Enforce: timednessValue must be null when timedness is 'none'
  // and must be provided when timedness is 'deadline' or 'scheduled'
  @ValidateIf(
    (o) => o.timedness !== undefined && o.timedness !== TaskTimedness.NONE,
  )
  @IsNumber()
  @IsNotEmpty({
    message:
      'timednessValue is required when timedness is deadline or scheduled',
  })
  readonly timednessValue?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly completedAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly scheduledAt?: Date;
}
