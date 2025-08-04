import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Identification } from 'src/identification/schemas/identification.schema';
import { Lactation } from 'src/lactation/schemas/lactation.schema';
import { Rebouclage } from 'src/rebouclage/schemas/rebouclage.schema';
import { UserRole } from 'src/users/schemas/users/user.role';
import { StatisticsPeriod } from './enums/statistics-period.enum';
import { Insemination } from 'src/inseminations/schemas/insemination.schema';
import { ReqCurrentUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class StatsService {
  //
  constructor(
    @InjectModel(Identification.name)
    private readonly identificationModel: Model<Identification>,
    @InjectModel(Lactation.name)
    private readonly lactationModel: Model<Lactation>,
    @InjectModel(Rebouclage.name)
    private readonly rebouclageModel: Model<Rebouclage>,
    @InjectModel(Insemination.name)
    private readonly inseminationModel: Model<Insemination>,
  ) {}

  async getMetrics(user: ReqCurrentUser, period: StatisticsPeriod) {
    const match = this.buildDateFilter(period);
    const { userId,role } = user;
    if(role.includes(UserRole.ADMIN)) return this.getAdminStats(match);
    else if (role.includes(UserRole.ELEVEUR)) return this.getEleveurStats(match, user.userId);
    else if( role.includes(UserRole.INSEMINATEUR)) return this.getInseminateurStats(match, user.userId);
    else if (role.includes(UserRole.IDENTIFICATEUR)) return this.getIdentificateurStats(match, user.userId);
    else if (role.includes(UserRole.CONTROLEUR_LAITIER)) return this.getControleurLaitierStats(match, user.userId);
    else if (role.includes(UserRole.RESPONSABLE_LOCAL)) return this.getResponsableLocalStats(match, user.userId);
    else return {}
  }
  private buildDateFilter(period: StatisticsPeriod): any {
    const now = new Date();
    const filter: any = {};

    switch (period) {
      case StatisticsPeriod.AUJOURDHUI:
        filter.createdAt = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        };
        break;
      case StatisticsPeriod.CETTE_SEMAINE:
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filter.createdAt = { $gte: startOfWeek };
        break;
      case StatisticsPeriod.CE_MOIS:
        filter.createdAt = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        };
        break;
      case StatisticsPeriod.CETTE_ANNEE:
        filter.createdAt = { $gte: new Date(now.getFullYear(), 0, 1) };
        break;
      case StatisticsPeriod.ALL:
      default:
        break;
    }

    return filter;
  }
  private async getAdminStats(match: any) {
    const totalBovins = await this.identificationModel.countDocuments(match);
    const totalInseminations =
      await this.inseminationModel.countDocuments(match);
    const totalLactation = await this.lactationModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$lait_kg' } } },
    ]);
    const totalRebouclages = await this.rebouclageModel.countDocuments(match);

    return {
      totalBovins,
      totalInseminations,
      totalLactation: totalLactation[0]?.total ?? 0,
      totalRebouclages,
    };
  }

  private async getEleveurStats(match: any, userId: string) {
    match['complem.eleveur_id'] = new Types.ObjectId(userId);

    const totalBovins = await this.identificationModel.countDocuments(match);
    const totalLactation = await this.lactationModel.aggregate([
      {
        $match: {
          ...match,
          controleur_laitier_id: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$lait_kg' },
        },
      },
    ]);

    return {
      totalBovins,
      totalLaitCollecte: totalLactation[0]?.total ?? 0,
    };
  }
  private async getInseminateurStats(match: any, userId: string) {
    match.inseminateur_id = new Types.ObjectId(userId);
    const totalInseminations =
      await this.inseminationModel.countDocuments(match);
    return { totalInseminations };
  }

  private async getIdentificateurStats(match: any, userId: string) {
    match.createdBy = new Types.ObjectId(userId);
    const totalIdentifications =
      await this.identificationModel.countDocuments(match);
    const totalRebouclages = await this.rebouclageModel.countDocuments(match);
    return { totalIdentifications, totalRebouclages };
  }

  private async getControleurLaitierStats(match: any, userId: string) {
    match.controleur_laitier_id = new Types.ObjectId(userId);
    const lactation = await this.lactationModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$lait_kg' } } },
    ]);
    return { totalLaitCollecte: lactation[0]?.total ?? 0 };
  }

  private async getResponsableLocalStats(match: any, userId: string) {
    match['complem.responsable_local_id'] = new Types.ObjectId(userId);
    const totalBovins = await this.identificationModel.countDocuments(match);
    return { totalBovins };
  }
}
