import { Injectable } from '@nestjs/common';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { StockTechnicalAnalyser } from './stock-technical-analyser';
import { orderBy } from 'lodash';
import { TechnicalLabel } from '../model/technical-label';

@Injectable()
export class StockTechnicalLabeler {
  constructor(private stockTechnicalAnalyser: StockTechnicalAnalyser) {}

  async for(symbol: SymbolWithExchange): Promise<TechnicalLabel[]> {
    const events = await this.stockTechnicalAnalyser.for(symbol);

    console.table(events);

    const {
      breakout,
      body_length_perc_from_sma,
      volume_perc_from_sma,
      tr_from_atr,
      body_perc,
    } = orderBy(events, 'date', 'desc')[0];

    if (
      breakout &&
      body_length_perc_from_sma > 200 &&
      volume_perc_from_sma > 200 &&
      tr_from_atr > 200 &&
      body_perc > 60
    ) {
      return [
        {
          title: 'Body length perc from SMA',
          description: `${body_length_perc_from_sma}%`,
        },
        {
          title: 'Volume perc from SMA',
          description: `${volume_perc_from_sma}%`,
        },
        {
          title: 'TR from ATR',
          description: `${tr_from_atr}%`,
        },
        {
          title: 'Body perc',
          description: `${body_perc}%`,
        },
      ];
    }

    return [];
  }
}
