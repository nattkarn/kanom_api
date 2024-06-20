import { Module } from '@nestjs/common';
import { ReportProductService } from './report-product.service';
import { ReportProductController } from './report-product.controller';

@Module({
  controllers: [ReportProductController],
  providers: [ReportProductService],
})
export class ReportProductModule {}
