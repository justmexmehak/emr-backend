import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { PrescriptionItem } from './prescription_item.entity';

@Entity()
export class VisitRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.visits, {
    onDelete: 'CASCADE',
  })
  patient: Patient;

  @Column()
  visitDate: Date;

  @OneToMany(
    () => PrescriptionItem,
    (prescription_item) => prescription_item.visit_record,
  )
  prescription: PrescriptionItem[];

  @Column()
  diagnosis: string;

  @Column()
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
