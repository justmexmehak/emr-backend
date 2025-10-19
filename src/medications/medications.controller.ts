import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user.entity';
import { ApiResponse } from 'src/response.interface';
import { MedicationsService } from './medications.service';
import { Medication } from './medication.entity';
import { CreateMedicationDTO } from './dto/create-medication.dto';

@Controller('medications')
@ApiTags('Medications')
@UseGuards(AuthGuard(), RolesGuard)
@ApiBearerAuth()
export class MedicationsController {
  constructor(private medicationsService: MedicationsService) {}

  // a create medication controller
  @Post()
  @ApiOperation({ summary: 'Create a new medication' })
  @Roles(UserRole.ADMIN)
  createMedication(
    @Body() createMedicationDto: CreateMedicationDTO,
  ): Promise<ApiResponse<Medication>> {
    return this.medicationsService.createMedication(createMedicationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve all medications' })
  getMeications(): Promise<ApiResponse<Medication[]>> {
    return this.medicationsService.getMedications();
  }
}
