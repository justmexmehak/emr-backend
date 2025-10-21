import { Body, Controller, Post, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { ApiResponse } from '../response.interface';
import { VisitRecordsService } from './visit_records.service';
import { VisitRecord } from './visit_record.entity';
import { CreateVisitRecordDTO } from './dto/create-visit-record.dto';

@Controller('visit-records')
@ApiTags('Visit Records')
@UseGuards(AuthGuard(), RolesGuard)
@ApiBearerAuth()
export class VisitRecordsController {
  constructor(private visitRecordsService: VisitRecordsService) {}

  @Post(':patient_id')
  @ApiOperation({ summary: 'Create a new visit record' })
  @Roles(UserRole.ADMIN)
  createVisitRecord(
    @Param('patient_id') patient_id: string,
    @Body() createVisitRecordDto: CreateVisitRecordDTO,
  ): Promise<ApiResponse<VisitRecord>> {
    return this.visitRecordsService.createExistingPatientVisit(
      patient_id,
      createVisitRecordDto,
    );
  }
}
