import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {

  constructor (
    private userService:UserService,
    private jwtService:JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ){}


  async login(user: any){
    const payload = { email: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }


  async validateUser(email: string, password: string): Promise<any>{
    const user = await this.userService.findByEmail(email);
    if(user && (await bcrypt.compare(password, user.password)))
    {
      const result = user as any;
      // console.log(result)
      return {
        email: result.email,
        userId: result._id,
      }
    }
    return null;
  }

  // เพิ่ม google Login เข้ามา
  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { email, name, picProfile, googleId } = req.user;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        name,
        picProfile,
        googleId,
        isVerify: true
      });
      
      await user.save();
    }

    const payload = { email: user.email , sub: user._id};

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

}
