import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PrescriptionItemDTO {
  @ApiProperty({ example: 'Paracetamol' })
  @IsString()
  name: string;

  @ApiProperty({ example: '500mg' })
  @IsString()
  dosage: string;

  @ApiProperty({ example: 'Twice a day' })
  @IsString()
  frequency: string;

  @ApiProperty({ example: '5 days' })
  @IsString()
  duration: string;
}
