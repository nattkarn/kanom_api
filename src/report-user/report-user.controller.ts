import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ReportUserService } from './report-user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('report-user')
export class ReportUserController {
  constructor(private readonly reportUserService: ReportUserService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.reportUserService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  findUser(@Query('id') id: string) {
    return this.reportUserService.findUser(id);
  }

  
}
