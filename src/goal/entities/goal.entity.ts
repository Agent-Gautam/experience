import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';
import { GoalState } from '../enums/goal-state.enum.js';
import { Task } from '../../task/entities/task.entity.js';

@Entity()
@Unique(['name'])
@Unique(['priority'])
@Index(['state'])
@Index(['progressTracking'])
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: GoalState,
    default: GoalState.ACTIVE,
    comment: 'Goal state can be active, paused or planned',
  })
  state: GoalState;

  @Column()
  priority: number;

  @Column('text', { array: true, nullable: true })
  purposes: string[];

  @Column({ nullable: true })
  defaultDurationPerTask: number;

  @Column({ nullable: true })
  sessionsPerWeek: number;

  @Column({ default: false, comment: 'Indicates whether progress tracking is enabled for the goal' })
  progressTracking: boolean;
  
  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.goal, { cascade: false })
  tasks: Task[];
}
