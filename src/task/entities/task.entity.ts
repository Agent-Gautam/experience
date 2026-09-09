import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum.js';
import { TaskTimedness } from '../enums/task-timedness.enum.js';
import { Goal } from '../../goal/entities/goal.entity.js';

@Entity()
@Check(
  `("timedness" = 'none' AND "timednessValue" IS NULL) OR ("timedness" IN ('deadline', 'scheduled') AND "timednessValue" IS NOT NULL)`,
)
@Index(['status'])
@Index(['scheduledAt'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  duration: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskTimedness,
    default: TaskTimedness.NONE,
    comment: 'Task must be done at or before specific time or none',
  })
  timedness: TaskTimedness;

  @Column({ nullable: true, comment: 'Value associated with timedness' })
  timednessValue: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment:
      'Task is scheduled to be started at this time, different from timedness any task can be scheduled by the app',
  })
  scheduledAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // relationship with goal

  @ManyToOne(
    () => Goal,
    (goal) => goal.tasks,
    { nullable: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'goalId' })
  goal: Goal;

  @Column({ nullable: true })
  goalId: number;
}
