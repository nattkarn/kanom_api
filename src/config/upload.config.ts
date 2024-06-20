import { diskStorage } from 'multer';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

// Define the file filter function
const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new BadRequestException('Only image files are allowed!'), false);
    }
    callback(null, true);
  };


export const MulterOptions = {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = path.extname(file.originalname);
        const fileName = `${uniqueSuffix}${fileExt}`;
        // console.log('filename:',fileName)
        cb(null, fileName);
      },
    }),
    fileFilter: imageFileFilter,
  }