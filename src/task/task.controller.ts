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
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.create(createTaskDto);
    return { message: 'Task created successfully', data: task };
  }

  @Get()
  async findAll(@Query('include') include?: string) {
    const includeGoal = include?.split(',').includes('goal');
    const tasks = await this.taskService.findAll({ includeGoal });
    return { message: 'Tasks retrieved successfully', data: tasks };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('include') include?: string) {
    const includeGoal = include?.split(',').includes('goal');
    const task = await this.taskService.findOne(+id, { includeGoal });
    return { message: 'Task retrieved successfully', data: task };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(+id, updateTaskDto);
    return { message: 'Task updated successfully', data: task };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedTask = await this.taskService.remove(+id);
    return { message: 'Task deleted successfully', data: deletedTask };
  }
}
