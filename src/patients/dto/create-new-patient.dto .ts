import { IsString, IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PrescriptionItemDTO } from './prescription-item.dto';

export class CreateNewPatientDTO {
  @ApiProperty({
    description: 'Patient Name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Patient Contact Number',
    example: '+1234567890',
  })
  @IsString()
  contact?: string;

  @ApiProperty({
    description: 'Patient Age',
    example: 30,
  })
  @Type(() => Number)
  age?: number;

  @ApiProperty({
    description: 'Patient Gender',
    example: 'male',
  })
  @IsEnum(['male', 'female'])
  gender: string;

  @ApiProperty({
    description: 'Visit Date',
    example: '2025-08-15',
  })
  @Type(() => Date)
  visitDate: Date;

  @ApiProperty({
    description: 'Diagnosis',
    example: 'Obsessive Compulsive Disorder',
  })
  @IsString()
  diagnosis: string;

  @ApiProperty({
    description: 'Notes of visit',
    example: 'Next session on Wednesday',
  })
  @IsString()
  notes: string;

  @ApiProperty({
    description: 'prescription',
    type: [PrescriptionItemDTO],
    example: [
      {
        name: 'Paracetamol 500mg',
        dosage: '2 tbsp',
        frequency: 'Twice a day',
        duration: '5 days',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDTO)
  prescription: PrescriptionItemDTO[];
}
