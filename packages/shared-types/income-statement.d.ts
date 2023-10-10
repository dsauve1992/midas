export type QuarterDto = {
   quarterNumber: number,
   year: number,
}

export type QuarterlyIncomeStatementDto = {
   date?: string,
   acceptedDate?: string,
   quarter: QuarterDto;
   earnings?: {
      current: number;
      previous?: number;
      growth?: number;
   };
   sales?: {
      current: number;
      previous?: number;
      growth?: number;
   };
   netProfitMargin?: number;
}