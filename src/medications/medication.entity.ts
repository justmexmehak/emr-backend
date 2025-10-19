import { PrescriptionItem } from 'src/visit_records/prescription_item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => PrescriptionItem,
    (prescription_items) => prescription_items.medication,
  )
  prescription_items: PrescriptionItem[];

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  created_at: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updated_at: Date;
}
