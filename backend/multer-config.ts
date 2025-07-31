import { MulterOptions } from 'multer';

export const multerMemoryStorage: MulterOptions = {
  storage: require('multer').memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
};
