import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalService } from './goal.service.js';
import { GoalController } from './goal.controller.js';
import { Goal } from './entities/goal.entity.js';
import { TaskModule } from '../task/task.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), TaskModule],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
