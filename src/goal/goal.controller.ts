import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GoalService } from './goal.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGoalDto: CreateGoalDto) {
    const goal = await this.goalService.create(createGoalDto);
    return { message: 'Goal created successfully', data: goal };
  }

  @Get()
  async findAll() {
    const goals = await this.goalService.findAll();
    return { message: 'Goals retrieved successfully', data: goals };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const goal = await this.goalService.findOne(+id);
    return { message: 'Goal retrieved successfully', data: goal };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    const goal = await this.goalService.update(+id, updateGoalDto);
    return { message: 'Goal updated successfully', data: goal };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedGoal = await this.goalService.remove(+id);
    return { message: 'Goal deleted successfully', data: deletedGoal };
  }
}
