import { Controller, Get, Post, Body, Query, UseGuards, Request, Patch, UseInterceptors, UploadedFile, BadRequestException, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '../config/upload.config';
import { UpdateDTO } from './dto/update.dto';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { ForgetPasswordDTO, ForgetPasswordEmailDTO } from './dto/forgetPassword.dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  @Get('/')
  status() {
    return "hello"
  }


  @Post('/register')
  async create(@Body() registerDto: RegisterDTO) {
    const created =  await this.userService.create(registerDto);
    console.log("🚀 ~ UserController ~ create ~ created:", created)
    if(created){
      return 'created'
    }else{
      return 'user exists'
    }
  }


  @Get('/activation')
  @Redirect('http://localhost:5000/login', 302)
  async activate(@Query('token') token: string) {
    const result = await this.userService.activateAccount(token);
    if (result) {
      return { url: 'http://localhost:5000/login' };
    }
    return 'Invalid or expired activation token. Please Check your Email again';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {

    const baseUrl = this.configService.get<string>('BASE_URL');
    const user = await this.userService.findByEmail(req.user.email)

    const profilePicUrl = (await user).picProfile ? `${baseUrl}/${(await user).picProfile}` : null;
    const data = {
      "email": user.email,
      "name": user.name,
      "tel": user.tel,
      "profilePicUrl": profilePicUrl
    }
    return data
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/picture')
  @UseInterceptors(FileInterceptor('file', MulterOptions))
  async uploadFile(@Request() req, @UploadedFile()
  file: Express.Multer.File, @Body() updateDTO: UpdateDTO,) {


    let filename = file.filename
    // Save the file information to the database
    const updatedUser = await this.userService.updatePicture(req.user.userId, filename);

    return updatedUser
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async updateProfile(@Request() req, @Body() updateDTO: UpdateDTO,) {


    // Save the file information to the database
    const updatedUser = await this.userService.updateProfile(req.user.userId, updateDTO);

    return updatedUser
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/password')
  async changePassword(@Request() req, @Body() changePasswordDTO: ChangePasswordDTO) {
    // console.log('pass:',changePasswordDTO)
    const changePassword = await this.userService.changePassword(req.user.userId, changePasswordDTO);

    if (changePassword) {
      return { changePassword: "ChangePassword OK" }
    } else {
      return { changePassword: "ChangePassword Not Ok" }
    }


  }


  @Post('/forgetpassword')
  async forgetPassword(@Request() req, @Body() forgetPasswordEmailDTO: ForgetPasswordEmailDTO) {

    const result = await this.userService.forgetPassword(forgetPasswordEmailDTO);
    if (result) {
      return 'Email Reset Password is sent';
    }
    return 'Invalid or expired activation token. Please Check your Email again';
  }

  @Get('/forgetpasswordtoken')
  @Redirect('http://localhost:5000/changepassword', 302)
  async forgetPasswordCheck(@Query('token') token: string) {
    const result = await this.userService.forgetPasswordCheck(token);
    if (result) {
      return {
        url: 'http://localhost:5000/changepassword',
        token: token,
        setPasswordAllow: true
      };
    }
    throw new BadRequestException({
      message: 'Invalid or expired activation token. Please Check your Email again'
    })
  }

  @Post('/changepassword')
  @Redirect('http://localhost:5000/login', 302)
  async changepassword(@Query('token') token: string, @Body() changePasswordDTO: ChangePasswordDTO) {
    const result = await this.userService.changePasswordFromToken(token, changePasswordDTO);

    if(result){
      return {
        url: 'http://localhost:5000/login',
        msg: "Password has been reset"
      };
    }
    

  }
}


