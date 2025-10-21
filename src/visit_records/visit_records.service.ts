import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { VisitRecord } from './visit_record.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PrescriptionItem } from './prescription_item.entity';
import { Medication } from '../medications/medication.entity';
import { CreateVisitRecordDTO } from './dto/create-visit-record.dto';
import { MedicationsService } from '../medications/medications.service';
import { ApiResponse } from '../response.interface';

@Injectable()
export class VisitRecordsService {
  constructor(
    @InjectRepository(VisitRecord)
    private visitRecordsRepository: Repository<VisitRecord>,

    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,

    @Inject()
    private medicationsService: MedicationsService,
  ) {}

  async createVisit(
    patient_id: string,
    visitDate: Date,
    diagnosis: string,
    notes: string,
  ): Promise<VisitRecord> {
    const visit_record = this.visitRecordsRepository.create({
      patient: { id: patient_id },
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

  async createExistingPatientVisit(
    patient_id: string,
    createVisitRecordDto: CreateVisitRecordDTO,
  ): Promise<ApiResponse<VisitRecord>> {
    try {
      const { visitDate, diagnosis, notes, prescription } =
        createVisitRecordDto;
      const visit_record = await this.createVisit(
        patient_id,
        visitDate,
        diagnosis,
        notes,
      );
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      prescription.forEach(async (item) => {
        const { name, dosage, frequency, duration } = item;

        let medication = await this.medicationsService.getMedication(name);
        if (medication === null) {
          medication = await this.medicationsService.create(name);
          // await this.medicationsRepository.save(med);
        }

        await this.createPrescriptionItem(
          visit_record,
          medication,
          dosage,
          frequency,
          duration,
        );
      });

      return {
        data: visit_record,
        message: 'Visit Record created successfully',
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error creating visit record',
        status: 500,
      };
    }
  }
}
