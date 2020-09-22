import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Portfolio } from './entities/portfolio.entity';
import { PortfolioDto } from './dtos/portfolio.dto';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {
  }

  count(): Promise<number> {
    return this.portfolioRepository.count();
  }

  save(portfoliosDtos: PortfolioDto[]): Promise<Portfolio[]> {
    const portfolios = portfoliosDtos.map(p => getFromDto<Portfolio>(p, new Portfolio()));
    return this.portfolioRepository.save(portfolios);
  }
}
