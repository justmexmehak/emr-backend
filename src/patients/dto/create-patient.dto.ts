import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDTO {
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
}
