import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, BadRequestException  } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);


  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5000', 'https://react-login-six-plum.vercel.app'], // Allow requests from localhost:3000 (adjust the port if necessary)
    credentials: true, // Enable cookies or HTTP authentication,
    optionsSuccessStatus: 200,
  });
  
  // app.enableCors()
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด properties ของข้อมูลที่ส่งเข้ามาที่ไม่ได้นิยามไว้ใน dto ออกไป
      forbidNonWhitelisted: true, // ตัวเลือกนี้จะทำงานคู่กับ whitelist โดยหากตั้งค่าเป็น true จะทำให้เกิด error ในกรณีนี้มี properties ใดที่ไม่ได้อยู่ใน whitelist ส่งเข้ามา
      transform: true, // ตัวเลือกนี้ทำให้เกิดการแปลงชนิดข้อมูลอัตโนมัติ ในข้อมูลจากภายนอกให้ตรงกับชนิดที่นิยามไว้ใน DTO
      exceptionFactory: (errors) => {
        // ตัวเลือกนี้ทำให้สามารถกำหนดรูปแบบของ error response เมื่อการตรวจ validation ล้มเหลวได้
        const messages = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints).join('. ') + '.',
        }));
        return new BadRequestException({ errors: messages });
      },
    }),
  );

  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
