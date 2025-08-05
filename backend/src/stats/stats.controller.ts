import { Controller, Get, Query, UseGuards} from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/decorators/active-user.decorator';
import { StatisticsPeriod } from './enums/statistics-period.enum';
import { ReqCurrentUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('api/v1/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('metrics')
  getMetrics(
    @CurrentUser() user: ReqCurrentUser,
    @Query('period') period: StatisticsPeriod = StatisticsPeriod.ALL,
  ) {
    return this.statsService.getMetrics(user, period);
  }
}
