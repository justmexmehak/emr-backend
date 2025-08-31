import { Module } from '@nestjs/common';
import { VisitRecordsController } from './visit_records.controller';
import { VisitRecordsService } from './visit_records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionItem } from './prescription_item.entity';
import { VisitRecord } from './visit_record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitRecord, PrescriptionItem])],
  controllers: [VisitRecordsController],
  providers: [VisitRecordsService],
  exports: [VisitRecordsService],
})
export class VisitRecordsModule {}
