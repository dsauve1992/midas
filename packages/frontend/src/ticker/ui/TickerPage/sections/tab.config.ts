import React from 'react'
import IncomeStatementPanel from './IncomeStatement/IncomeStatementPanel'
import EarningsSurprisesPanel from './EarningSurprise/EarningsSurprisesPanel'
import InsiderTradingPanel from './Insider/InsiderTradingPanel'
import InstitutionalHoldersPanel from './InstitutionalHolders/InstitutionalHoldersPanel'
import SocialSentimentPanel from './SocialSentiment/SocialSentimentPanel'
import EarningCallTranscriptPanel from './EarningCallTranscript/EarningCallTranscriptPanel'

export enum TickerPageTab {
   INCOME_STATEMENT_TAB = '1',
   EARNING_CALL_TRANSCRIPT = '2',
   EARNING_SURPRISE_TAB = '3',
   INSIDER_TRADING_TAB = '4',
   INSTITUTIONAL_HOLDERS_TAB = '5',
   SOCIAL_SENTIMENT = '6',
}

export type TabsConfig = {
   id: TickerPageTab
   label: string
   PanelComponent: React.FunctionComponent<{ symbol: string }>
}[]

export const config: TabsConfig = [
   {
      id: TickerPageTab.INCOME_STATEMENT_TAB,
      label: 'Income Statements',
      PanelComponent: IncomeStatementPanel,
   },
   {
      id: TickerPageTab.EARNING_CALL_TRANSCRIPT,
      label: 'Earning call transcript',
      PanelComponent: EarningCallTranscriptPanel,
   },
   {
      id: TickerPageTab.EARNING_SURPRISE_TAB,
      label: 'Earning Surprises',
      PanelComponent: EarningsSurprisesPanel,
   },
   {
      id: TickerPageTab.INSIDER_TRADING_TAB,
      label: 'Insider Trading',
      PanelComponent: InsiderTradingPanel,
   },
   {
      id: TickerPageTab.INSTITUTIONAL_HOLDERS_TAB,
      label: 'Institutional Holders',
      PanelComponent: InstitutionalHoldersPanel,
   },
   {
      id: TickerPageTab.SOCIAL_SENTIMENT,
      label: 'Social Sentiment',
      PanelComponent: SocialSentimentPanel,
   },
]
