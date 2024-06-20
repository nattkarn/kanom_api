import { Injectable } from '@nestjs/common';
import { CreateReportProductDto } from './dto/create-report-product.dto';
import { UpdateReportProductDto } from './dto/update-report-product.dto';

@Injectable()
export class ReportProductService {
  create(createReportProductDto: CreateReportProductDto) {
    return 'This action adds a new reportProduct';
  }

  findAll() {
    return `This action returns all reportProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportProduct`;
  }

  update(id: number, updateReportProductDto: UpdateReportProductDto) {
    return `This action updates a #${id} reportProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportProduct`;
  }
}
