import {
  Controller,
  Patch,
  Param,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Patch('validate/:id')
  async validerDemande(
    @Param('id') userId: string,

    @Body()
    body: {
      password: string;
      role: string;
    },
  ) {
    const result = await this.adminService.validerUtilisateur(
      userId,
      body.password,
      body.role,
    );

    if (!result) {
      throw new NotFoundException('Utilisateur introuvable ou déjà validé.');
    }

    return {
      message: 'Compte validé avec succès',
      user: result,
    };
  }
}
