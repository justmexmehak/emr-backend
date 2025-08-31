import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VisitRecord } from './visit_record.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/patient.entity';
import { PrescriptionItem } from './prescription_item.entity';
import { Medication } from 'src/medications/medication.entity';

@Injectable()
export class VisitRecordsService {
  constructor(
    @InjectRepository(VisitRecord)
    private visitRecordsRepository: Repository<VisitRecord>,

    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
  ) {}

  async createVisit(
    patient: Patient,
    visitDate: Date,
    diagnosis: string,
    notes: string,
  ): Promise<VisitRecord> {
    const visit_record = this.visitRecordsRepository.create({
      patient,
      visitDate,
      diagnosis,
      notes,
    });
    try {
      await this.visitRecordsRepository.save(visit_record);
      return visit_record;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createPrescriptionItem(
    visit_record: VisitRecord,
    medication: Medication,
    dosage: string,
    duration: string,
    frequency: string,
  ): Promise<void> {
    const prescription_item = this.prescriptionItemRepository.create({
      visit_record,
      medication,
      dosage,
      duration,
      frequency,
    });
    await this.prescriptionItemRepository.save(prescription_item);
  }
}
