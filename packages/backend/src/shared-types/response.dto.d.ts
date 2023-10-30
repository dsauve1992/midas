export type StockGeneralInformationResponseDto = {
  symbol: string;
  companyName: string;
  exchangeShortName: string;
  industry: string;
  description: string;
  sector: string;
  image: string;
  technicalRating: number;
  fundamentalRating: number;
  returnOnEquity: number;
  outstandingShares: number;
};
