import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'; 
import { extname } from 'path';
import { diskStorage } from 'multer';

export const multerMemoryStorage:MulterOptions = {
    storage: require("multer").memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, 
    }
};

export const IdentificationMulterConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/identifications',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(new Error('Only JPG/PNG image files are allowed!'), false);
    } else {
      cb(null, true);
    }
  },
  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },
};

