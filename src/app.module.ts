import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from './config/upload.config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReportUserModule } from './report-user/report-user.module';
import { ReportProductModule } from './report-product/report-product.module';


@Module({
  imports: [
    // For serve static path
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','uploads')
      
  }),

    MulterModule.register(MulterOptions),

    //เพิ่มไว้สำหรับอ่าน .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
    ,


    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),

    UserModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    ReportUserModule,
    ReportProductModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
