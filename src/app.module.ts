/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { AuthModule } from './auth/auth.module';
import { VisitRecordsModule } from './visit_records/visit_records.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { MedicationsModule } from './medications/medications.module';

@Module({
  imports: [
    PatientsModule,
    AuthModule,
    VisitRecordsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'emr',
      autoLoadEntities: true,
      synchronize: false,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
          maxsize: 2 * 1024 * 1024,
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 2 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
    }),
    MedicationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
