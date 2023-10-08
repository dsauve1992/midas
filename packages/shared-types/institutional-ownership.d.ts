export interface InstitutionalOwnershipResponse {
   history: AggregateHolding[],
   topShareholders: ShareholderHistory[]
}

export interface AggregateHolding {
   securityId: string
   numberOfSecurityHolders: number
   sharesHeld: number
   valueOfShares: number
   holdingPeriod: HoldingPeriod
   sharesChangePercent: number
   valueChangePercent: number
   outstandingPercent: number
}

export interface OwnershipHistoryResponse {
   aggregateHoldings: AggregateHolding[]
}

export interface TopShareholdersResponse {
   securityOwnerships: ShareholderHistory[]
}

export interface ShareholderHistory {
   securityId: string
   securityName: string
   ticker: string
   sector: string
   issuerThumbnailUrl: string
   holder: Holder
   sharesHeld: number
   valueOfShares: number
   holdingPeriod: HoldingPeriod
   sharesChangePercent: number
   valueChangePercent: number
   portfolioPercent: number
   outstandingPercent: number
}

export interface Holder {
   holderName: string
   holderId: string
   thumbnailUrl: string
}

export interface HoldingPeriod {
   quarterOfYear: string
   year: number
}
