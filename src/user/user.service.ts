import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Import UserDocument

import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO } from './dto/update.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { ForgetPasswordDTO, ForgetPasswordEmailDTO } from './dto/forgetPassword.dto';

import { v4 as uuidv4 } from 'uuid'; // For generating unique tokens
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';


import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { } // Use UserDocument type

  async create(registerDTO: RegisterDTO): Promise<User> {
    const activationToken = uuidv4();
    const baseUrl = this.configService.get<string>('BASE_URL');

    let data = {
      ...registerDTO,
      activationToken: activationToken
    }

    const newUser = new this.userModel(data);
    newUser.tokenCreatedAt = new Date();  // Set token creation time
    await newUser.save();

    const activationLink = `${baseUrl}/user/activation?token=${activationToken}`;

    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Account Activation',
      text: `Please activate your account using the following link: ${activationLink}`,
    });

    return newUser
  }

  async activateAccount(token: string): Promise<boolean> {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const user = await this.userModel.findOne({ activationToken: token });
    if (!user) {
      throw new BadRequestException('token is invalid');
    }
    // Check if the token is expired
    const tokenExpirationTime = 24 * 60 * 60 * 1000; // 24 hours
    const tokenAge = Date.now() - new Date(user.tokenCreatedAt).getTime();
    if (tokenAge > tokenExpirationTime) {
      const activationToken = uuidv4();
      const activationLink = `${baseUrl}/user/activation?token=${activationToken}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Account Activation is resent',
        text: `Please activate your account using the following link: ${activationLink}`,
      });
      user.activationToken = activationToken
      user.tokenCreatedAt = new Date();  // Set token creation time
      await user.save()
      return false
    }


    user.isVerify = true;
    user.activationToken = null; // Optionally clear the token after activation
    await user.save();
    return true;
  }

  async updatePicture(id: string, fileName: string) {

    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.userModel.findById(id).exec();
    result.picProfile = fileName
    await result.save()
    return result
  }


  async updateProfile(id: string, updateDTO: UpdateDTO) {

    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.userModel.findByIdAndUpdate(id, updateDTO, { new: true }).exec();

    return result
  }


  async findByEmail(email: string): Promise<User> {

    const user = this.userModel.findOne({ email }).exec()

    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user

  }

  async changePassword(id: string, changePasswordDTO: ChangePasswordDTO) {




    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException('User not found');
    }


    // console.log('raw password:', changePasswordDTO.password)

    const passwordHash = await bcrypt.hash(changePasswordDTO.password, 10);

    // console.log('passwordHash:', passwordHash)


    const result = await this.userModel.findByIdAndUpdate(id, { "password": passwordHash }, { new: true }).exec();


    await this.mailerService.sendMail({
      to: result.email,
      subject: 'Password is Changed',
      text: `Password is Changed`,
    });

    return true


  }


  async forgetPassword(forgetPasswordEmailDTO: ForgetPasswordEmailDTO) {
    const baseUrl = this.configService.get<string>('BASE_URL');

    forgetPasswordEmailDTO.email
    const user = await this.userModel.findOne({ email: forgetPasswordEmailDTO.email }).exec()


    if (!user) {
      throw new BadRequestException('User not found');
    }




    const forgetPasswordToken = uuidv4();
    const forgetPasswordLink = `${baseUrl}/user/forgetpasswordtoken?token=${forgetPasswordToken}`;

    await this.mailerService.sendMail({
      to: forgetPasswordEmailDTO.email,
      subject: 'Password has been Reset',
      text: `Please Reset your password using the following link: ${forgetPasswordLink}`,
    });
    user.tokenForgetPassword = forgetPasswordToken
    user.tokenForgetPasswordCreatedAt = new Date();  // Set token creation time
    await user.save()

    return {
      "forgetPassword": "forgetPassword OK"
    };
  }

  async forgetPasswordCheck(token: string): Promise<boolean> {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const user = await this.userModel.findOne({ tokenForgetPassword: token });
    if (!user) {
      throw new BadRequestException('token is invalid');
    }
    // Check if the token is expired
    const tokenExpirationTime = 24 * 60 * 60 * 1000; // 24 hours
    const tokenAge = Date.now() - new Date(user.tokenForgetPasswordCreatedAt).getTime();
    if (tokenAge > tokenExpirationTime) {
      const forgetPasswordToken = uuidv4();
      const forgetPasswordLink = `${baseUrl}/user/forgetpasswordtoken?token=${forgetPasswordToken}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Account Activation is resent',
        text: `Please activate your account using the following link: ${forgetPasswordLink}`,
      });
      user.tokenForgetPassword = forgetPasswordToken
      user.tokenForgetPasswordCreatedAt = new Date();  // Set token creation time
      await user.save()
      return false
    }
    // console.log('flag Set')
    user.setPasswordAllow = true
    await user.save()
    return true;
  }


  async changePasswordFromToken(token: string, changePasswordDTO: ChangePasswordDTO) {

    const user = await this.userModel.findOne({ tokenForgetPassword: token , setPasswordAllow: true });
    if (!user) {
      throw new NotFoundException('User not found or you not allow here');
    }


    // console.log('raw password:', changePasswordDTO.password)

    const passwordHash = await bcrypt.hash(changePasswordDTO.password, 10);


    const result = await this.userModel.findByIdAndUpdate(user._id, { "password": passwordHash }, { new: true }).exec();

    result.tokenForgetPassword = null
    result.setPasswordAllow = false
    await result.save()


    await this.mailerService.sendMail({
      to: result.email,
      subject: 'Password is Changed',
      text: `Password is Changed`,
    });

    return true


  }


  async findAll() {
    // Exclude sensitive fields
    const result = await this.userModel.find().select('-password -activationToken -tokenCreatedAt -__v');
  
    // Create a new dataset with non-sensitive information
    const sanitizedResult = result.map(user => ({
      ID: user._id,
      email: user.email,
      name: user.name,
      isVerify: user.isVerify,
      picProfile: user.picProfile,
      tel: user.tel
    }));
  
    return sanitizedResult;
  }


  async findUser(id:string) {
    // Exclude sensitive fields
    const result = await this.userModel.findById(id).select('-password -activationToken -tokenCreatedAt -__v');
  
    // Create a new dataset with non-sensitive information
    const sanitizedResult = {
      ID: result._id,
      email: result.email,
      name: result.name,
      isVerify: result.isVerify,
      picProfile: result.picProfile,
      tel: result.tel
    };
  
    return sanitizedResult;
  }
}
