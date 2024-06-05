import React from "react";
import IncomeStatementPanel from "./IncomeStatement/IncomeStatementPanel.tsx";
import EarningsSurprisesPanel from "./EarningSurprise/EarningsSurprisesPanel.tsx";
import InsiderTradingPanel from "./Insider/InsiderTradingPanel.tsx";
import InstitutionalHoldersPanel from "./InstitutionalHolders/InstitutionalHoldersPanel.tsx";
import SocialSentimentPanel from "./SocialSentiment/SocialSentimentPanel.tsx";

export enum TickerPageTab {
  INCOME_STATEMENT_TAB = "1",
  EARNING_SURPRISE_TAB = "3",
  INSIDER_TRADING_TAB = "5",
  INSTITUTIONAL_HOLDERS_TAB = "6",
  SOCIAL_SENTIMENT = "7",
}

export type TabsConfig = {
  id: TickerPageTab;
  label: string;
  PanelComponent: React.FunctionComponent<{ symbol: string }>;
}[];

export const config: TabsConfig = [
  {
    id: TickerPageTab.INCOME_STATEMENT_TAB,
    label: "Income Statements",
    PanelComponent: IncomeStatementPanel,
  },
  {
    id: TickerPageTab.EARNING_SURPRISE_TAB,
    label: "Earning Surprises",
    PanelComponent: EarningsSurprisesPanel,
  },
  {
    id: TickerPageTab.INSIDER_TRADING_TAB,
    label: "Insider Trading",
    PanelComponent: InsiderTradingPanel,
  },
  {
    id: TickerPageTab.INSTITUTIONAL_HOLDERS_TAB,
    label: "Institutional Holders",
    PanelComponent: InstitutionalHoldersPanel,
  },
  {
    id: TickerPageTab.SOCIAL_SENTIMENT,
    label: "Social Sentiment",
    PanelComponent: SocialSentimentPanel,
  },
];
