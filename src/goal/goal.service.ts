import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { Goal } from './entities/goal.entity.js';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    try {
      const goal = this.goalRepository.create(createGoalDto);
      return await this.goalRepository.save(goal);
    } catch (error: any) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation
        if (error.detail && error.detail.includes('name')) {
          throw new BadRequestException(
            'A goal with this name already exists.',
          );
        }
        throw new BadRequestException(
          'A goal with this priority already exists.',
        );
      }
      throw new InternalServerErrorException('Failed to create goal');
    }
  }

  async findAll(): Promise<Goal[]> {
    try {
      return await this.goalRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve goals');
    }
  }

  async findOne(id: number): Promise<Goal> {
    try {
      const goal = await this.goalRepository.findOneBy({ id });
      if (!goal) {
        throw new NotFoundException(`Goal with ID ${id} not found`);
      }
      return goal;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve goal');
    }
  }

  async update(id: number, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    try {
      const result = await this.goalRepository.update(id, updateGoalDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Goal with ID ${id} not found`);
      }
      return await this.findOne(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        if (error.detail && error.detail.includes('name')) {
          throw new BadRequestException(
            'A goal with this name already exists. Please use a different name.',
          );
        }
        throw new BadRequestException(
          'A goal with this priority already exists. Please use a different priority value.',
        );
      }
      throw new InternalServerErrorException('Failed to update goal');
    }
  }

  async remove(id: number): Promise<Goal> {
    try {
      const goal = await this.findOne(id);
      await this.goalRepository.delete(id);
      return goal;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete goal');
    }
  }
}
