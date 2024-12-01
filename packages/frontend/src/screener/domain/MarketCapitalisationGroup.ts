export type MarketCapitalisationGroup =
  | "shrimp"
  | "micro_cap"
  | "small_cap"
  | "mid_cap"
  | "large_cap";

export function getMarketCapitalisationGroup(
  market: number,
): MarketCapitalisationGroup {
  switch (true) {
    case market < 50000000:
      return "shrimp";
    case market < 300000000:
      return "micro_cap";
    case market < 2000000000:
      return "small_cap";
    case market < 10000000000:
      return "mid_cap";
    default:
      return "large_cap";
  }
}
