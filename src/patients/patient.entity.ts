import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
} from 'typeorm';
import { VisitRecord } from '../visit_records/visit_record.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  contact: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
  })
  gender: string;

  @Column({ unique: true })
  @Generated('increment')
  mrNumber: number;

  @OneToMany(() => VisitRecord, (visitRecord) => visitRecord.patient)
  visits: VisitRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
