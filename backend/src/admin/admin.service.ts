import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}
   async validerUtilisateur(userId: string, password: string, role: string): Promise<User | null> {
    const utilisateur = await this.userModel.findById(userId);

    if (!utilisateur || utilisateur.metadata?.statut === 'valide') {
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    utilisateur.password = hashedPassword;
    utilisateur.role = role;
    utilisateur.metadata.statut = 'valide';
    utilisateur.date_modification = new Date();

    return utilisateur.save();
  }

 async rejeterDemande(userId: string): Promise<User | null> {
  return this.userModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        metadata: { statut: 'rejeté' },
        date_modification: new Date(),
      },
    },
    { new: true }
  );
}

}
