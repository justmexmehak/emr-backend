import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationDTO {
  @ApiProperty({
    description: 'Medication Name',
    example: 'Panadol 500mg',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
