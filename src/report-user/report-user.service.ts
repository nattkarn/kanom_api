import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class ReportUserService {

  constructor(
    private userService: UserService
  ) { } // Use UserDocument type

  async findAll() {
    return await this.userService.findAll();
  }



  async findUser(id: string) {
    return await this.userService.findUser(id);
  }


}
