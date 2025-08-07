import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Response } from 'express';
import { UserRole } from 'src/users/schemas/users/user.role';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import {File as MulterFile} from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PhotosRequiredValidator } from 'src/common/validators/photo-required-validator';

@Controller('api/v1/identifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.IDENTIFICATEUR, UserRole.ADMIN)
export class IdentificationController {
  constructor(private readonly identificationService: IdentificationService) {}

  @Get('export')
  async exportData(
    @Res() res: Response,
    @Query('format') format: 'csv' | 'excel',
    @Query('nni') nni?: string,
    @Query('date_naissance') date_naissance?: string,
    @Query('race') race?: string,
  ) {
    const buffer = await this.identificationService.export(format, {
      nni,
      date_naissance,
      race,
    });

    const filename = `identifications.${format === 'excel' ? 'xlsx' : 'csv'}`;
    res.setHeader(
      'Content-Type',
      format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(buffer);
  }
  @Post()
  @UseInterceptors(FilesInterceptor('photos', 5))
  async create(
    @Body() body: any,
    @CurrentUser() user: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new PhotosRequiredValidator({}),
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/i, })
        ],
      })
    ) photos: MulterFile[],
  ) {
    const data: CreateIdentificationDto = {
      ...body,
      infos_sujet: JSON.parse(body.infos_sujet),
      infos_mere: JSON.parse(body.infos_mere),
      grand_pere_maternel: JSON.parse(body.grand_pere_maternel),
      pere: JSON.parse(body.pere),
      grand_pere_paternel: JSON.parse(body.grand_pere_paternel),
      grand_mere_paternelle: JSON.parse(body.grand_mere_paternelle),
      complem: JSON.parse(body.complem),
      createdBy: user?.userId,
    };
    console.log(data,photos)
    return this.identificationService.create(data, photos);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.identificationService.findAll(query);
  }

  @Get('filter')
  async filter(
    @Query('nni') nni?: string,
    @Query('date_naissance') date_naissance?: string,
    @Query('race') race?: string,
  ) {
    return this.identificationService.filter({
      nni,
      date_naissance,
      race,
    });
  }
  @Delete(':id')
  async deleteIdentification(@Param('id') id: string) {
    return this.identificationService.delete(id);
  }
}
