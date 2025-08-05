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
    const previousMatch = this.buildPreviousPeriodFilter(period);
    const { userId, role } = user;

    if (role.includes(UserRole.ADMIN)) {
      return this.getMetricsWithChange(
        () => this.getAdminStats(match),
        () => this.getAdminStats(previousMatch)
      );
    }

    if (role.includes(UserRole.ELEVEUR)) {
      return this.getMetricsWithChange(
        () => this.getEleveurStats(match, userId),
        () => this.getEleveurStats(previousMatch, userId)
      );
    }

    if (role.includes(UserRole.INSEMINATEUR)) {
      return this.getMetricsWithChange(
        () => this.getInseminateurStats(match, userId),
        () => this.getInseminateurStats(previousMatch, userId)
      );
    }

    if (role.includes(UserRole.IDENTIFICATEUR)) {
      return this.getMetricsWithChange(
        () => this.getIdentificateurStats(match, userId),
        () => this.getIdentificateurStats(previousMatch, userId)
      );
    }

    if (role.includes(UserRole.CONTROLEUR_LAITIER)) {
      return this.getMetricsWithChange(
        () => this.getControleurLaitierStats(match, userId),
        () => this.getControleurLaitierStats(previousMatch, userId)
      );
    }

    if (role.includes(UserRole.RESPONSABLE_LOCAL)) {
      return this.getMetricsWithChange(
        () => this.getResponsableLocalStats(match, userId),
        () => this.getResponsableLocalStats(previousMatch, userId)
      );
    }

    return {};
  }

  private buildDateFilter(period: StatisticsPeriod): any {
    const now = new Date();
    const filter: any = {};
    let startOfWeek: Date;
    switch (period) {
      case StatisticsPeriod.AUJOURDHUI:
        filter.createdAt = { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
        break;
      case StatisticsPeriod.CETTE_SEMAINE:
        startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filter.createdAt = { $gte: startOfWeek };
        break;
      case StatisticsPeriod.CE_MOIS:
        filter.createdAt = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
        break;
      case StatisticsPeriod.CETTE_ANNEE:
        filter.createdAt = { $gte: new Date(now.getFullYear(), 0, 1) };
        break;
      default:
        break;
    }

    return filter;
  }

  private buildPreviousPeriodFilter(period: StatisticsPeriod): any {
    const now = new Date();
    const filter: any = {};
    let yesterday: Date;
    let startOfLastWeek: Date;
    let endOfLastWeek: Date;
    let startOfLastMonth: Date;
    let endOfLastMonth: Date;
    let startOfLastYear: Date;
    let endOfLastYear: Date;

    switch (period) {
      case StatisticsPeriod.AUJOURDHUI:
        yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        filter.createdAt = {
          $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        };
        break;
      case StatisticsPeriod.CETTE_SEMAINE:
        startOfLastWeek = new Date(now);
        startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
        endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 7);
        filter.createdAt = { $gte: startOfLastWeek, $lt: endOfLastWeek };
        break;
      case StatisticsPeriod.CE_MOIS:
        startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filter.createdAt = { $gte: startOfLastMonth, $lt: endOfLastMonth };
        break;
      case StatisticsPeriod.CETTE_ANNEE:
        startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        endOfLastYear = new Date(now.getFullYear(), 0, 1);
        filter.createdAt = { $gte: startOfLastYear, $lt: endOfLastYear };
        break;
      default:
        break;
    }

    return filter;
  }

  private async getMetricsWithChange(currentFn: () => Promise<any>, previousFn: () => Promise<any>) {
    const current = await currentFn();
    const previous = await previousFn();

    const getChange = (curr: number, prev: number) => {
      if (prev === 0) return curr === 0 ? 0 : 100;
      return ((curr - prev) / prev) * 100;
    };

    return Object.fromEntries(
      Object.entries(current).map(([key, value]) => {
        const prevValue = previous[key] ?? 0;
        return [key, { value, change: getChange(value as number, prevValue) }];
      })
    );
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
          ...match
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
    const totalRebouclages = await this.rebouclageModel.countDocuments({ identificateur_id: userId });
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
