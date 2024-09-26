export type NewScreenerEntryFrontendDto = {
  symbol: string;
  exchange: string;
  labels: {
    title: string;
    description: string;
  }[];
};
