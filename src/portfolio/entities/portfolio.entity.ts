import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PortfolioDto } from '../dtos/portfolio.dto';

@Entity('portfolio')
export class Portfolio extends SoftDelete {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  comment: string;

  @Column({ type: 'text', array: true, default: '{}' })
  attachments: string[];

  toDto(): PortfolioDto {
    return {
      name: this.name,
      comment: this.comment,
      attachments: this.attachments,
    };
  }
}
