import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { spawn } from 'child_process';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export interface TechnicalAnalysisEvent {
  date: Date;
  body_length_perc_from_sma: number;
  body_perc: number;
  tr_from_atr: number;
  volume_perc_from_sma: number;
  breakout: boolean;
}

interface TechnicalAnalysisEventPythonResponse {
  Date: string;
  body_length_perc_from_sma: number;
  body_perc: number;
  tr_from_atr: number;
  volume_perc_from_sma: number;
  breakout: boolean;
}

@Injectable()
export class StockTechnicalAnalyser {
  for(symbol: SymbolWithExchange) {
    const pythonPath = path.resolve(
      __dirname,
      '../../../../python-scripts/venv/bin/python3',
    );
    const scriptPath = path.resolve(
      __dirname,
      '../../../../python-scripts/src/analysis.py',
    );

    return new Promise<TechnicalAnalysisEvent[]>((resolve, reject) => {
      const pythonScript = spawn(
        process.env.NODE_ENV === 'production' ? 'python3' : pythonPath,
        [scriptPath, symbol.symbol],
      );

      let result = '';
      let error = '';

      pythonScript.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonScript.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonScript.on('close', (code) => {
        if (code === 0) {
          try {
            const jsonResult = JSON.parse(result)[
              'data'
            ] as TechnicalAnalysisEventPythonResponse[];
            resolve(
              jsonResult.map(
                (event) =>
                  ({
                    ...event,
                    date: new Date(event.Date),
                  }) as TechnicalAnalysisEvent,
              ),
            );
          } catch (e) {
            reject(`Error parsing JSON: ${e}`);
          }
        } else {
          reject(`Process exited with code ${code}: ${error}`);
        }
      });
    });
  }
}
