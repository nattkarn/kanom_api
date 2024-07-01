import { Controller, Request, Post, Res, UseGuards, Get, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'
import { GoogleAuthGuard } from './google-auth.guard'
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough:true}) res){
    // console.log('req:',req.user)


    const User = await this.userService.findByEmail(req.user.email)

    if(!User){
      throw new BadRequestException({
        message : 'User not Found'
      })
    }

    if(!User.isVerify){
      throw new UnauthorizedException({
        message : 'User is Unverified'
      }
      )
    }


    const { accessToken } = await this.authService.login(req.user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    
    return {
      message: 'Login successful',
      access_token: accessToken
    }
  }

  // เพิ่มส่วนที่เกี่ยวกับ google
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Request() req) {
    // Initiates the Google OAuth process
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Request() req, @Res( {passthrough:true }) res) {
    const { accessToken } = await this.authService.googleLogin(req);
    // res.cookie("access_token", accessToken, {
    //   maxAge: 300000,
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: "none",
    // });
    return {
      message: 'Login successful',
      access_token: accessToken
    }
  }

   // เพิ่ม logout
   @Get('logout')
   async logout(@Request() req, @Res() res) {
    //  res.clearCookie('access_token', {
    //   secure:true,
    //   httpOnly: true,
    //  });
     return res.json({ message: 'Successfully logged out' });
   }
  
}
