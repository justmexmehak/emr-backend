import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Medication } from './medication.entity';
import type { LoggerService } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiResponse } from '../response.interface';
import { CreateMedicationDTO } from './dto/create-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService,
  ) {}

  async createMedication(
    createMedicationDto: CreateMedicationDTO,
  ): Promise<ApiResponse<Medication>> {
    const medication = this.medicationRepository.create(createMedicationDto);
    try {
      await this.medicationRepository.save(medication);
      return {
        data: medication,
        message: 'Medication created successfully',
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error creating medication',
        status: 500,
      };
    }
  }

  async getMedications(): Promise<ApiResponse<Medication[]>> {
    try {
      const medications = await this.medicationRepository.find();
      return {
        data: medications,
        message: 'Medications retrieved successfully',
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: 'Error retrieving medications',
        status: 500,
      };
    }
  }

  async getMedication(name: string): Promise<Medication | null> {
    return await this.medicationRepository.findOneBy({ name });
  }

  async create(name: string): Promise<Medication> {
    const med = this.medicationRepository.create({ name });
    return await this.medicationRepository.save(med);
  }
}
