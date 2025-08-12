import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { RebouclageService } from './rebouclage.service';
import { RebouclageController } from './rebouclage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rebouclage, RebouclageSchema } from './schemas/rebouclage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rebouclage.name, schema: RebouclageSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      },
    }),
  ],
  controllers: [RebouclageController],
  providers: [RebouclageService],
  exports: [RebouclageService],
})
export class RebouclageModule {}
