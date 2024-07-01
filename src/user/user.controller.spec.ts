import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterDTO } from './dto/register.dto';
import { MockType, mockModel } from '../utils/mock.model'; // Utility to mock Mongoose model


describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  // let userModel: MockType<Model<UserDocument>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: MailerService,
          useValue: {}, // Provide a mock implementation or value
        }
    ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService)
  });

  it('Status OK', () => {
    expect(userController.status()).toBe('hello');
  });

  describe('create', () => {


    it('should create a user', async () => {
      const registerDto: RegisterDTO = {
        email: 'test@mail.com',
        password: 'testpass',
        name: 'Test User',
        tel: '',
        googleId: ''
      };

      expect(userController.create(registerDto)).toBe('user exists')
    });
  });
});