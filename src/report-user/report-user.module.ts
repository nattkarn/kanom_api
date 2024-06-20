import { Module } from '@nestjs/common';
import { ReportUserService } from './report-user.service';
import { ReportUserController } from './report-user.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  controllers: [ReportUserController],
  providers: [ReportUserService],
})
export class ReportUserModule {}
