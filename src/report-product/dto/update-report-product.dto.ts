import { PartialType } from '@nestjs/mapped-types';
import { CreateReportProductDto } from './create-report-product.dto';

export class UpdateReportProductDto extends PartialType(CreateReportProductDto) {}
