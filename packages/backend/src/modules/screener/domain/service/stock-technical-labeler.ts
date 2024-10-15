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

    if (events.length === 0) {
      return [];
    }

    const {
      breakout,
      body_length_perc_from_sma,
      volume_perc_from_sma,
      tr_from_atr,
    } = orderBy(events, 'date', 'desc')[0];

    if (
      breakout &&
      body_length_perc_from_sma > 100 &&
      volume_perc_from_sma > 150 &&
      tr_from_atr > 100
    ) {
      return [
        {
          title: 'Body length perc from SMA',
          description: body_length_perc_from_sma.toFixed(2),
        },
        {
          title: 'Volume perc from SMA',
          description: volume_perc_from_sma.toFixed(2),
        },
        {
          title: 'TR from ATR',
          description: tr_from_atr.toFixed(2),
        },
      ];
    }

    return [];
  }
}
