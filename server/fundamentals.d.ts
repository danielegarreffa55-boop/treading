export type Evidence = {
    label: string;
    value?: number | string;
    period?: string;
    currency?: string;
    source: 'Yahoo Finance' | 'derived';
    direction: 'positive' | 'negative' | 'neutral';
};
export declare function assessCompany(history: any[], current: any): {
    overall: string;
    strengths: never[];
    weaknesses: never[];
    warnings: string[];
    missingData: string[];
} | {
    overall: string;
    strengths: Evidence[];
    weaknesses: Evidence[];
    warnings: never[];
    missingData: never[];
};
export declare function getCompanyIntelligence(symbolValue: string): Promise<{
    symbol: string;
    assetClass: any;
    applicable: boolean;
    reason: string;
    sources: {
        provider: string;
        sourceType: string;
        retrievedAt: string;
        confidence: string;
    }[];
    identity?: undefined;
    profile?: undefined;
    history?: undefined;
    metrics?: undefined;
    quality?: undefined;
    valuation?: undefined;
    plainLanguage?: undefined;
    dataQuality?: undefined;
    contextId?: undefined;
} | {
    reason?: undefined;
    symbol: string;
    assetClass: string;
    applicable: boolean;
    identity: {
        symbol: string;
        exchange: any;
        currency: any;
        reportingCurrency: any;
        assetClass: string;
        providerMappings: {
            yahoo: string;
        };
    };
    profile: {
        legalName: any;
        description: any;
        sector: any;
        industry: any;
        country: any;
        headquarters: string;
        employees: any;
        website: any;
        reportingCurrency: any;
    };
    history: {
        period: string;
        currency: any;
        revenue: any;
        grossProfit: any;
        ebitda: any;
        netIncome: any;
        dilutedEps: any;
        operatingCashFlow: any;
        capitalExpenditure: any;
        freeCashFlow: any;
        cash: any;
        totalDebt: any;
        netDebt: any;
        equity: any;
        shares: any;
    }[];
    metrics: {
        marketCap: any;
        revenue: any;
        freeCashFlow: any;
        totalDebt: any;
        cash: any;
        netDebt: number | null;
        roe: any;
        grossMargin: any;
        operatingMargin: any;
        trailingPE: any;
        forwardPE: any;
        priceToBook: any;
        evToEbitda: any;
        dividendYield: any;
    };
    quality: {
        overall: string;
        strengths: never[];
        weaknesses: never[];
        warnings: string[];
        missingData: string[];
    } | {
        overall: string;
        strengths: Evidence[];
        weaknesses: Evidence[];
        warnings: never[];
        missingData: never[];
    };
    valuation: {
        status: string;
        limitations: string[];
    };
    plainLanguage: string;
    dataQuality: {
        status: string;
        coverage: {
            metrics: number;
            history: number;
        };
        missingFields: string[];
        lastUpdated: string;
        providerNotes: string[];
    };
    sources: {
        provider: string;
        sourceType: string;
        retrievedAt: string;
        currency: any;
        confidence: string;
    }[];
    contextId: string;
}>;
