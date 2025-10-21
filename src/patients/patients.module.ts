import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { AuthModule } from '../auth/auth.module';
import { VisitRecordsModule } from '../visit_records/visit_records.module';
import { MedicationsModule } from '../medications/medications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    AuthModule,
    VisitRecordsModule,
    MedicationsModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
