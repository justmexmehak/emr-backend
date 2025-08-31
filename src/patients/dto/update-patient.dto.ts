import { IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePatientDTO {
  @ApiPropertyOptional({
    description: 'Patient Name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'Patient Contact Number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional({
    description: 'Patient Age',
    example: 30,
  })
  @Type(() => Number)
  @IsOptional()
  age?: number;
}
