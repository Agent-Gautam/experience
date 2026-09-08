import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalService } from './goal.service.js';
import { GoalController } from './goal.controller.js';
import { Goal } from './entities/goal.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
