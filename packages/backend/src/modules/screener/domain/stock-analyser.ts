import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { spawn } from 'child_process';
import { SymbolWithExchange } from '../../stocks/domain/symbol-with-exchange';

export interface TechnicalAnalysisEvent {
  date: string;
  event: string;
}

@Injectable()
export class StockAnalyser {
  for(symbol: SymbolWithExchange) {
    const pythonPath = path.resolve(
      __dirname,
      '../../../../../python-scripts/venv/bin/python3',
    );
    const scriptPath = path.resolve(
      __dirname,
      '../../../../../python-scripts/src/analysis.py',
    );

    return new Promise((resolve, reject) => {
      const process = spawn(pythonPath, [scriptPath, symbol.symbol]);

      let result = '';
      let error = '';

      process.stdout.on('data', (data) => {
        result += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const jsonResult = JSON.parse(result);
            resolve(jsonResult as TechnicalAnalysisEvent[]);
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
