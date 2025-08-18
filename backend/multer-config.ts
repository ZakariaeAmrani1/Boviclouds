import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'; 


export const multerMemoryStorage:MulterOptions = {
    storage: require("multer").memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, 
    }
};



