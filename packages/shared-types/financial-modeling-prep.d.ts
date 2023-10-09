export type StockSymbol = {
   symbol: string
   name: string
   price: number
   exchange: Exchange
}

export type ScreenSymbol = {
   symbol: string
   companyName: string
   marketCap: number
   sector: Sector
   industry: string
   beta: number
   price: number
   lastAnnualDividend: number
   volume: number
   exchange: Exchange
   exchangeShortName: string
   country: string
   isEtf: boolean
   isActivelyTrading: boolean
}

export type Exchange =
   | 'New York Stock Exchange Arca'
   | 'Nasdaq Global Select'
   | 'New York Stock Exchange'
   | 'Nasdaq Global Market'
   | 'Nasdaq Capital Market'
   | 'BATS Exchange'
   | 'NYSE American'
   | 'NASDAQ Global Market'
   | 'Other OTC'
   | 'YHD'
   | 'Paris'
   | 'Amsterdam'
   | 'Brussels'
   | 'Lisbon'
   | 'Toronto'
   | 'NYSEArca'
   | 'BATS'
   | 'AMEX'
   | 'EURONEXT'
   | 'TSX'
   | 'Swiss'
   | 'MCX'
   | 'XETRA'
   | 'NSE'
   | 'LSE'
   | 'SIX'
   | 'HKSE'
   | 'ASX'
   | 'OSE'
   | 'NASDAQ'
   | 'Sao Paolo'
   | 'TSXV'
   | 'Frankfurt'
   | 'NMS'
   | 'HKG'
   | 'NCM'
   | 'MCE'
   | 'ASE'
   | 'OSL'
   | 'Oslo'
   | 'FGI'
   | 'Irish'
   | 'Canadian Sec'
   | 'NZSE'
   | 'Nasdaq'
   | 'NasdaqGS'

export type CashFlowStatement = {
   date: string
   symbol: string
   reportedCurrency: string
   fillingDate: string
   acceptedDate: string
   period: string
   netIncome: number
   depreciationAndAmortization: number
   deferredIncomeTax: number
   stockBasedCompensation: number
   changeInWorkingCapital: number
   accountsReceivables: number
   inventory: number
   accountsPayables: number
   otherWorkingCapital: number
   otherNonCashItems: number
   netCashProvidedByOperatingActivities: number
   investmentsInPropertyPlantAndEquipment: number
   acquisitionsNet: number
   purchasesOfInvestments: number
   salesMaturitiesOfInvestments: number
   otherInvestingActivites: number
   netCashUsedForInvestingActivites: number
   debtRepayment: number
   commonStockIssued: number
   commonStockRepurchased: number
   dividendsPaid: number
   otherFinancingActivites: number
   netCashUsedProvidedByFinancingActivities: number
   effectOfForexChangesOnCash: number
   netChangeInCash: number
   cashAtEndOfPeriod: number
   cashAtBeginningOfPeriod: number
   operatingCashFlow: number
   capitalExpenditure: number
   freeCashFlow: number
   link: string
   finalLink: string
}

export type CashFlowStatementGrowth = {
   date: string
   symbol: string
   period: string
   growthNetIncome: number
   growthDepreciationAndAmortization: number
   growthDeferredIncomeTax: number
   growthStockBasedCompensation: number
   growthChangeInWorkingCapital: number
   growthAccountsReceivables: number
   growthInventory: number
   growthAccountsPayables: number
   growthOtherWorkingCapital: number
   growthOtherNonCashItems: number
   growthNetCashProvidedByOperatingActivites: number
   growthInvestmentsInPropertyPlantAndEquipment: number
   growthAcquisitionsNet: number
   growthPurchasesOfInvestments: number
   growthSalesMaturitiesOfInvestments: number
   growthOtherInvestingActivites: number
   growthNetCashUsedForInvestingActivites: number
   growthDebtRepayment: number
   growthCommonStockIssued: number
   growthCommonStockRepurchased: number
   growthDividendsPaid: number
   growthOtherFinancingActivites: number
   growthNetCashUsedProvidedByFinancingActivities: number
   growthEffectOfForexChangesOnCash: number
   growthNetChangeInCash: number
   growthCashAtEndOfPeriod: number
   growthCashAtBeginningOfPeriod: number
   growthOperatingCashFlow: number
   growthCapitalExpenditure: number
   growthFreeCashFlow: number
}

export type FinancialGrowth = {
   symbol: string
   date: string
   period: string
   revenueGrowth: number
   grossProfitGrowth: number
   ebitgrowth: number
   operatingIncomeGrowth: number
   netIncomeGrowth: number
   epsgrowth: number
   epsdilutedGrowth: number
   weightedAverageSharesGrowth: number
   weightedAverageSharesDilutedGrowth: number
   dividendsperShareGrowth: number
   operatingCashFlowGrowth: number
   freeCashFlowGrowth: number
   tenYRevenueGrowthPerShare: number
   fiveYRevenueGrowthPerShare: number
   threeYRevenueGrowthPerShare: number
   tenYOperatingCFGrowthPerShare: number
   fiveYOperatingCFGrowthPerShare: number
   threeYOperatingCFGrowthPerShare: number
   tenYNetIncomeGrowthPerShare: number
   fiveYNetIncomeGrowthPerShare: number
   threeYNetIncomeGrowthPerShare: number
   tenYShareholdersEquityGrowthPerShare: number
   fiveYShareholdersEquityGrowthPerShare: number
   threeYShareholdersEquityGrowthPerShare: number
   tenYDividendperShareGrowthPerShare: number
   fiveYDividendperShareGrowthPerShare: number
   threeYDividendperShareGrowthPerShare: number
   receivablesGrowth: number
   inventoryGrowth: number
   assetGrowth: number
   bookValueperShareGrowth: number
   debtGrowth: number
   rdexpenseGrowth: number
   sgaexpensesGrowth: number
}

export type IncomeStatementDto = {
   date: string
   symbol: string
   reportedCurrency: string
   fillingDate: string
   acceptedDate: string
   period: string
   calendarYear?: string
   revenue: number
   costOfRevenue: number
   grossProfit: number
   grossProfitRatio: number
   researchAndDevelopmentExpenses: number
   generalAndAdministrativeExpenses: number
   sellingAndMarketingExpenses: number
   otherExpenses: number
   operatingExpenses: number
   costAndExpenses: number
   interestExpense: number
   depreciationAndAmortization: number
   ebitda: number
   ebitdaratio: number
   operatingIncome: number
   operatingIncomeRatio: number
   totalOtherIncomeExpensesNet: number
   incomeBeforeTax: number
   incomeBeforeTaxRatio: number
   incomeTaxExpense: number
   netIncome: number
   netIncomeRatio: number
   eps: number
   epsdiluted: number
   weightedAverageShsOut: number
   weightedAverageShsOutDil: number
   link: string
   finalLink: string
}

export type EnterpriseValue = {
   symbol: string
   date: string
   stockPrice: number
   numberOfShares: number
   marketCapitalization: number
   minusCashAndCashEquivalents: number
   addTotalDebt: number
   enterpriseValue: number
}

export type EnterpriseRatio = {
   calendarYear: string,
   symbol: string
   date: string
   period: string
   currentRatio: number
   quickRatio: number
   cashRatio: number
   daysOfSalesOutstanding: number
   daysOfInventoryOutstanding: number
   operatingCycle: number
   daysOfPayablesOutstanding: number
   cashConversionCycle: number
   grossProfitMargin: number
   operatingProfitMargin: number
   pretaxProfitMargin: number
   netProfitMargin: number
   effectiveTaxRate: number
   returnOnAssets: number
   returnOnEquity: number
   returnOnCapitalEmployed: number
   netIncomePerEBT: number
   ebtPerEbit: number
   ebitPerRevenue: number
   debtRatio: number
   debtEquityRatio: number
   longTermDebtToCapitalization: number
   totalDebtToCapitalization: number
   interestCoverage: number
   cashFlowToDebtRatio: number
   companyEquityMultiplier: number
   receivablesTurnover: number
   payablesTurnover: number
   inventoryTurnover: number
   fixedAssetTurnover: number
   assetTurnover: number
   operatingCashFlowPerShare: number
   freeCashFlowPerShare: number
   cashPerShare: number
   payoutRatio: number
   operatingCashFlowSalesRatio: number
   freeCashFlowOperatingCashFlowRatio: number
   cashFlowCoverageRatios: number
   shortTermCoverageRatios: number
   capitalExpenditureCoverageRatio: number
   dividendPaidAndCapexCoverageRatio: number
   dividendPayoutRatio: number
   priceBookValueRatio: number
   priceToBookRatio: number
   priceToSalesRatio: number
   priceEarningsRatio: number
   priceToFreeCashFlowsRatio: number
   priceToOperatingCashFlowsRatio: number
   priceCashFlowRatio: number
   priceEarningsToGrowthRatio: number
   priceSalesRatio: number
   dividendYield: number
   enterpriseValueMultiple: number
   priceFairValue: number
}

export type EnterpriseRatioTTM = {
   dividendYielTTM: number
   dividendYielPercentageTTM: number
   peRatioTTM: number
   pegRatioTTM: number
   payoutRatioTTM: number
   currentRatioTTM: number
   quickRatioTTM: number
   cashRatioTTM: number
   daysOfSalesOutstandingTTM: number
   daysOfInventoryOutstandingTTM: number
   operatingCycleTTM: number
   daysOfPayablesOutstandingTTM: number
   cashConversionCycleTTM: number
   grossProfitMarginTTM: number
   operatingProfitMarginTTM: number
   pretaxProfitMarginTTM: number
   netProfitMarginTTM: number
   effectiveTaxRateTTM: number
   returnOnAssetsTTM: number
   returnOnEquityTTM: number
   returnOnCapitalEmployedTTM: number
   netIncomePerEBTTTM: number
   ebtPerEbitTTM: number
   ebitPerRevenueTTM: number
   debtRatioTTM: number
   debtEquityRatioTTM: number
   longTermDebtToCapitalizationTTM: number
   totalDebtToCapitalizationTTM: number
   interestCoverageTTM: number
   cashFlowToDebtRatioTTM: number
   companyEquityMultiplierTTM: number
   receivablesTurnoverTTM: number
   payablesTurnoverTTM: number
   inventoryTurnoverTTM: number
   fixedAssetTurnoverTTM: number
   assetTurnoverTTM: number
   operatingCashFlowPerShareTTM: number
   freeCashFlowPerShareTTM: number
   cashPerShareTTM: number
   operatingCashFlowSalesRatioTTM: number
   freeCashFlowOperatingCashFlowRatioTTM: number
   cashFlowCoverageRatiosTTM: number
   shortTermCoverageRatiosTTM: number
   capitalExpenditureCoverageRatioTTM: number
   dividendPaidAndCapexCoverageRatioTTM: number
   priceBookValueRatioTTM: number
   priceToBookRatioTTM: number
   priceToSalesRatioTTM: number
   priceEarningsRatioTTM: number
   priceToFreeCashFlowsRatioTTM: number
   priceToOperatingCashFlowsRatioTTM: number
   priceCashFlowRatioTTM: number
   priceEarningsToGrowthRatioTTM: number
   priceSalesRatioTTM: number
   dividendYieldTTM: number
   enterpriseValueMultipleTTM: number
   priceFairValueTTM: number
   dividendPerShareTTM: number
}

export type Rating = {
   symbol: string
   date: string
   rating: string
   ratingScore: number
   ratingRecommendation: string
   ratingDetailsDCFScore: number
   ratingDetailsDCFRecommendation: string
   ratingDetailsROEScore: number
   ratingDetailsROERecommendation: string
   ratingDetailsROAScore: number
   ratingDetailsROARecommendation: string
   ratingDetailsDEScore: number
   ratingDetailsDERecommendation: string
   ratingDetailsPEScore: number
   ratingDetailsPERecommendation: string
   ratingDetailsPBScore: number
   ratingDetailsPBRecommendation: string
}

export type ScreenFilter = {
   marketCapMoreThan: number
   marketCapLowerThan: number
   priceMoreThan: number
   priceLowerThan: number
   betaMoreThan: number
   betaLowerThan: number
   volumeMoreThan: number
   volumeLowerThan: number
   dividendMoreThan: number
   dividendLowerThan: number
   isEtf: boolean
   isActivelyTrading: boolean
   sector: string
   Industry: Industry
   exchange: string
   limit: number
}

export type StockProfile = {
   symbol: string
   price: number
   beta: number
   volAvg: number
   mktCap: number
   lastDiv: number
   range: string
   changes: number
   companyName: string
   currency: string
   isin: string
   cusip: string
   exchange: string
   exchangeShortName: string
   industry: string
   website: string
   description: string
   ceo: string
   sector: string
   country: string
   fullTimeEmployees: string
   phone: string
   address: string
   city: string
   state: string
   zip: string
   dcfDiff: number
   dcf: number
   image: string
   ipoDate: string
}

export type KeyMetrics = {
   revenuePerShareTTM: number
   netIncomePerShareTTM: number
   operatingCashFlowPerShareTTM: number
   freeCashFlowPerShareTTM: number
   cashPerShareTTM: number
   bookValuePerShareTTM: number
   tangibleBookValuePerShareTTM: number
   shareholdersEquityPerShareTTM: number
   interestDebtPerShareTTM: number
   marketCapTTM: number
   enterpriseValueTTM: number
   peRatioTTM: number
   priceToSalesRatioTTM: number
   pocfratioTTM: number
   pfcfRatioTTM: number
   pbRatioTTM: number
   ptbRatioTTM: number
   evToSalesTTM: number
   enterpriseValueOverEBITDATTM: number
   evToOperatingCashFlowTTM: number
   evToFreeCashFlowTTM: number
   earningsYieldTTM: number
   freeCashFlowYieldTTM: number
   debtToEquityTTM: number
   debtToAssetsTTM: number
   netDebtToEBITDATTM: number
   currentRatioTTM: number
   interestCoverageTTM: number
   incomeQualityTTM: number
   dividendYieldTTM: number
   dividendYieldPercentageTTM: number
   payoutRatioTTM: number
   salesGeneralAndAdministrativeToRevenueTTM: number
   researchAndDevelopementToRevenueTTM: number
   intangiblesToTotalAssetsTTM: number
   capexToOperatingCashFlowTTM: number
   capexToRevenueTTM: number
   capexToDepreciationTTM: number
   stockBasedCompensationToRevenueTTM: number
   grahamNumberTTM: number
   roicTTM: number
   returnOnTangibleAssetsTTM: number
   grahamNetNetTTM: number
   workingCapitalTTM: number
   tangibleAssetValueTTM: number
   netCurrentAssetValueTTM: number
   investedCapitalTTM: number
   averageReceivablesTTM: number
   averagePayablesTTM: number
   averageInventoryTTM: number
   daysSalesOutstandingTTM: number
   daysPayablesOutstandingTTM: number
   daysOfInventoryOnHandTTM: number
   receivablesTurnoverTTM: number
   payablesTurnoverTTM: number
   inventoryTurnoverTTM: number
   roeTTM: number
   capexPerShareTTM: number
   dividendPerShareTTM: number
}

export type DiscountedCashFlow = {
   symbol: string
   date: string
   dcf: number
   'Stock Price': number
}

export type InsiderTradingEvent = {
   symbol: string
   filingDate: string
   transactionDate: string
   reportingCik: string
   transactionType: string
   securitiesOwned: 1366
   companyCik: string
   reportingName: string
   typeOfOwner: string
   acquistionOrDisposition: string
   formType: string
   securitiesTransacted: number
   price: number
   securityName: string
   link: string
}

export type EarningsSurprise = {
   date: string
   symbol: string
   actualEarningResult: number
   estimatedEarning: number
}

export type StockPeer = {
   symbol: string
   peersList: string[]
}

export type SharesFloat = {
   symbol: string
   date: string
   freeFloat: number
   floatShares: number
   outstandingShares: number
   source: string
}

export type InstitutionalHolder = {
   holder: string
   shares: number
   dateReported: string
   change: number
}

export type SocialSentiment = {
   date: string
   symbol: string
   stocktwitsPosts: number
   twitterPosts: number
   stocktwitsComments: number
   twitterComments: number
   stocktwitsLikes: number
   twitterLikes: number
   stocktwitsImpressions: number
   twitterImpressions: number
   stocktwitsSentiment: number
   twitterSentiment: number
}

export type EarningCallTranscript = {
   symbol: string
   quarter: number
   year: number
   date: string
   content: string
}

export type Score = {
   symbol: string
   altmanZScore: number
   piotroskiScore: number
   workingCapital: string
   totalAssets: string
   retainedEarnings: string
   ebit: string
   marketCap: string
   totalLiabilities: string
   revenue: string
}

export type SearchResult = {
   symbol: string
   name: string
   currency: string
   stockExchange: string
   exchangeShortName: string
}

export enum Market {
   NASDAQ = 'nasdaq',
   NYSE = 'nyse',
   TSX = 'tsx',
}

export type RealTimeQuote = {
   symbol: string
   name: string
   price: number
   changesPercentage: number
   change: number
   dayLow: number
   dayHigh: number
   yearHigh: number
   yearLow: number
   marketCap: number
   priceAvg50: number
   priceAvg200: number
   exchange: string
   volume: number
   avgVolume: number
   open: number
   previousClose: number
   eps: number
   pe: number
   earningsAnnouncement: string
   sharesOutstanding: number
   timestamp: number
}

export type Sector =
   | 'Consumer Cyclical'
   | 'Energy'
   | 'Technology'
   | 'Industrials'
   | 'Financial Services'
   | 'Basic Materials'
   | 'Communication Services'
   | 'Consumer Defensive'
   | 'Healthcare'
   | 'Real Estate'
   | 'Utilities'
   | 'Industrial Goods'
   | 'Financial'
   | 'Services'
   | 'Conglomerates'
   | 'Pharmaceuticals'

export type Industry =
   | 'Autos'
   | 'Banks'
   | 'Banks Diversified'
   | 'Software'
   | 'Banks Regional'
   | 'Beverages Alcoholic'
   | 'Beverages Brewers'
   | 'Beverages Non'
   | 'Alcoholic'
