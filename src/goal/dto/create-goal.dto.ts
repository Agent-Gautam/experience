import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GoalState } from '../enums/goal-state.enum.js';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEnum(GoalState)
  @IsOptional()
  readonly state?: GoalState;

  @IsNumber()
  @IsNotEmpty()
  readonly priority: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly purposes?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Default duration per task must be a positive number' })
  readonly defaultDurationPerTask?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Sessions per week must be a positive number' })
  readonly sessionsPerWeek?: number;

  @IsOptional()
  @IsBoolean()
  readonly progressTracking?: boolean;

  @IsString()
  @IsOptional()
  readonly icon?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Banner URL must be a valid URL' })
  readonly bannerUrl?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly endDate?: Date;
}
