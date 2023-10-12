export type IncomeStatementDto = {
  acceptedDate?: string;
  period: string;
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
};
