import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreatePatientDTO } from './dto/create-patient.dto';
import { PatientsService } from './patients.service';
import { Patient } from './patient.entity';
import { ApiResponse, PaginationResponse } from '../response.interface';
import { UpdatePatientDTO } from './dto/update-patient.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/roles.decorator';
// import { GetUser } from '../auth/get-user.decorator';
import { UserRole } from '../auth/user.entity';
import { CreateNewPatientDTO } from './dto/create-new-patient.dto ';
import { GetPaginatedDTO } from 'src/dto/get-paginated.dto';

@Controller('patients')
@ApiTags('Patients')
@UseGuards(AuthGuard(), RolesGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @Roles(UserRole.ADMIN)
  createPatient(
    @Body() createPatientDto: CreatePatientDTO,
  ): Promise<ApiResponse<Patient>> {
    return this.patientsService.createPatient(createPatientDto);
  }

  @Post('new')
  @ApiOperation({ summary: 'Create a new patient with a visiting record' })
  @Roles(UserRole.ADMIN)
  createNewPatient(
    @Body() createNewPatientDto: CreateNewPatientDTO,
  ): Promise<ApiResponse<Patient>> {
    return this.patientsService.createNewPatient(createNewPatientDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve all patients' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getPatients(
    @Query() getPaginatedDto: GetPaginatedDTO,
  ): Promise<ApiResponse<PaginationResponse<Patient>>> {
    return this.patientsService.getPatients(getPaginatedDto);
  }

  @Patch(':patient_id')
  @ApiOperation({ summary: 'Update a specific patient' })
  @Roles(UserRole.ADMIN)
  updatePatient(
    @Param('patient_id') patient_id: string,
    @Body() updatePatientDto: UpdatePatientDTO,
  ): Promise<ApiResponse<Patient>> {
    return this.patientsService.updatePatient(patient_id, updatePatientDto);
  }

  @Delete(':patient_id')
  @ApiOperation({ summary: 'Delete a specific patient' })
  @Roles(UserRole.ADMIN)
  deletePatient(
    @Param('patient_id') patient_id: string,
  ): Promise<ApiResponse<void>> {
    return this.patientsService.deletePatient(patient_id);
  }
}
