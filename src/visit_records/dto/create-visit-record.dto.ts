import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PrescriptionItemDTO } from '../../patients/dto/prescription-item.dto';

export class CreateVisitRecordDTO {
  @ApiProperty({
    description: 'Visit Date',
    example: '2025-08-26 18:29:05.424553',
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
