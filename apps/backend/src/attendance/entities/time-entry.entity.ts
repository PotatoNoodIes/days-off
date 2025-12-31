import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'clock_in', type: 'timestamp' })
  clockIn: Date;

  @Column({ name: 'clock_out', type: 'timestamp', nullable: true })
  clockOut: Date;

  @Column({ name: 'duration_seconds', type: 'int', nullable: true })
  durationSeconds: number;

  @Column({ type: 'jsonb', nullable: true })
  location_in: any;

  @Column({ type: 'jsonb', nullable: true })
  location_out: any;

  @CreateDateColumn()
  createdAt: Date;
}
