import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { VisitRecord } from './visit_record.entity';
import { Medication } from 'src/medications/medication.entity';

@Entity()
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VisitRecord, (visit_record) => visit_record.prescription, {
    onDelete: 'CASCADE',
  })
  visit_record: VisitRecord;

  @ManyToOne(() => Medication, (medication) => medication.prescription_items, {
    onDelete: 'CASCADE',
  })
  medication: Medication;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  duration: string;
}
