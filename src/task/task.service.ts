import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create(createTaskDto);
      return await this.taskRepository.save(task);
    } catch (error: any) {
      if (error.code === '23514') {
        // CHECK constraint violation
        throw new BadRequestException(
          'Invalid task data: timednessValue must be null when timedness is "none" and must be provided for deadline/scheduled',
        );
      }
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOneBy({ id });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const result = await this.taskRepository.update(id, updateTaskDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return await this.findOne(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23514') {
        throw new BadRequestException(
          'Invalid task data: timednessValue must be null when timedness is "none" and must be provided for deadline/scheduled',
        );
      }
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async remove(id: number): Promise<Task> {
    try {
      const task = await this.findOne(id);
      await this.taskRepository.delete(id);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
