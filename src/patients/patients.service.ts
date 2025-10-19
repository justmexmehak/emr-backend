import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { Repository } from 'typeorm';
import { CreatePatientDTO } from './dto/create-patient.dto';
import { UpdatePatientDTO } from './dto/update-patient.dto';
import { ApiResponse, PaginationResponse } from '../response.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { CreateNewPatientDTO } from './dto/create-new-patient.dto ';
import { VisitRecordsService } from 'src/visit_records/visit_records.service';
import { MedicationsService } from 'src/medications/medications.service';
import { GetPaginatedDTO } from 'src/dto/get-paginated.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,

    @Inject()
    private visitRecordsService: VisitRecordsService,

    @Inject()
    private medicationsService: MedicationsService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService,
  ) {}

  async createPatient(
    createPatientDto: CreatePatientDTO,
  ): Promise<ApiResponse<Patient>> {
    const patient = this.patientsRepository.create(createPatientDto);
    try {
      await this.patientsRepository.save(patient);
      return {
        data: patient,
        message: 'Patient created successfully',
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error creating patient',
        status: 500,
      };
    }
  }

  async createNewPatient(
    createNewPatientDto: CreateNewPatientDTO
  ): Promise<ApiResponse<Patient>> {
    try {
      const {
        name,
        contact,
        age,
        gender,
        visitDate,
        diagnosis,
        notes,
        prescription,
      } = createNewPatientDto;
      const patient = this.patientsRepository.create({
        name,
        contact,
        age,
        gender,
      });
      await this.patientsRepository.save(patient);

      const visit_record = await this.visitRecordsService.createVisit(
        patient.id,
        visitDate,
        diagnosis,
        notes,
      );
      // await this.visitRecordsRepository.save(visit_record);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      prescription.forEach(async (item) => {
        const { name, dosage, frequency, duration } = item;

        let medication = await this.medicationsService.getMedication(name);
        if (medication === null) {
          medication = await this.medicationsService.create(name);
          // await this.medicationsRepository.save(med);
        }

        await this.visitRecordsService.createPrescriptionItem(
          visit_record,
          medication,
          dosage,
          frequency,
          duration,
        );

        // await this.prescriptionItemsRepository.save(prescription_item);
      });

      return {
        data: patient,
        message: 'Patient created successfully',
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error creating patient',
        status: 500,
      };
    }
  }

  async getPatients(
    getPaginatedDto: GetPaginatedDTO
  ): Promise<ApiResponse<PaginationResponse<Patient>>> {
    try {
      const { page = 1, limit = 10 } = getPaginatedDto;
      const [patients, total] = await this.patientsRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });
      const totalPages = Math.ceil(total / limit);
      const paginated_response = {
        data: patients,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
      return {
        data: paginated_response,
        message: 'Patients retrieved successfully',
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error retrieving patients',
        status: 500,
      };
    }
  }

  async getPatient(patient_id: string): Promise<ApiResponse<Patient>> {
    const patient = await this.patientsRepository.findOne({
      where: { id: patient_id },
      relations: [
        'visits',
        'visits.prescription',
        'visits.prescription.medication',
      ],
      order: {
        visits: {
          visitDate: 'DESC',
        },
      },
    });
    if (!patient) {
      return {
        data: null,
        message: 'Patient not found',
        status: 404,
      };
    }
    return {
      data: patient,
      message: 'Patient retrieved successfully',
      status: 200,
    };
  }

  async updatePatient(
    patient_id: string,
    updatePatientDto: UpdatePatientDTO,
  ): Promise<ApiResponse<Patient>> {
    const patient = await this.patientsRepository.findOneBy({ id: patient_id });
    if (!patient) {
      return {
        data: null,
        message: 'Patient not found',
        status: 404,
      };
    }
    Object.assign(patient, updatePatientDto);
    try {
      await this.patientsRepository.save(patient);
      return {
        data: patient,
        message: 'Patient updated successfully',
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error updating patient',
        status: 500,
      };
    }
  }

  async deletePatient(patient_id: string): Promise<ApiResponse<void>> {
    this.logger.log('Deleting patient with id: ', patient_id);
    const result = await this.patientsRepository.delete(patient_id);
    if (result.affected === 0) {
      return {
        data: null,
        message: 'Patient not found',
        status: 404,
      };
    }
    return {
      data: null,
      message: 'Patient deleted successfully',
      status: 200,
    };
  }
}
