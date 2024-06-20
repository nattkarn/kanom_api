import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportProductService } from './report-product.service';
import { CreateReportProductDto } from './dto/create-report-product.dto';
import { UpdateReportProductDto } from './dto/update-report-product.dto';

@Controller('report-product')
export class ReportProductController {
  constructor(private readonly reportProductService: ReportProductService) {}

  @Post()
  create(@Body() createReportProductDto: CreateReportProductDto) {
    return this.reportProductService.create(createReportProductDto);
  }

  @Get()
  findAll() {
    return this.reportProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportProductDto: UpdateReportProductDto) {
    return this.reportProductService.update(+id, updateReportProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportProductService.remove(+id);
  }
}
