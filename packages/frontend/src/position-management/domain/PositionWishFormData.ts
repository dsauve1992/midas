export type SymbolWithExchange = {
  exchange: string;
  symbol: string;
};

export type PositionWishFormDataProps = {
  symbol: SymbolWithExchange | null;
  portfolioValue: number;
  buyPrice: number;
  stopLoss: number;
  riskPercentage: number;
};

const DEFAULT_RISK_PERCENTAGE = 0.5;

export class PositionWishFormData {
  constructor(readonly props: PositionWishFormDataProps) {}

  get symbol() {
    return this.props.symbol;
  }

  get portfolioValue() {
    return this.props.portfolioValue;
  }

  get buyPrice() {
    return this.props.buyPrice;
  }

  get stopLoss() {
    return this.props.stopLoss;
  }

  get riskPercentage() {
    return this.props.riskPercentage;
  }

  static init() {
    return new PositionWishFormData({
      symbol: null,
      portfolioValue: 0,
      buyPrice: 0,
      stopLoss: 0,
      riskPercentage: DEFAULT_RISK_PERCENTAGE,
    });
  }

  get nbShares() {
    const { buyPrice, portfolioValue, riskPercentage, stopLoss } = this.props;
    return Math.floor(
      (portfolioValue * (riskPercentage / 100)) / (buyPrice - stopLoss),
    );
  }

  updateSymbol(symbol: SymbolWithExchange) {
    return new PositionWishFormData({
      ...this.props,
      symbol,
    });
  }

  updatePortfolioValue(portfolioValue: number) {
    return new PositionWishFormData({
      ...this.props,
      portfolioValue,
    });
  }

  updateBuyPrice(buyPrice: number) {
    return new PositionWishFormData({
      ...this.props,
      buyPrice,
    });
  }

  updateStopLoss(stopLoss: number) {
    return new PositionWishFormData({
      ...this.props,
      stopLoss,
    });
  }

  updateRiskPercentage(riskPercentage: number) {
    return new PositionWishFormData({
      ...this.props,
      riskPercentage,
    });
  }
}
