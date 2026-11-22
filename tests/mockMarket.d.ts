import type { Page } from '@playwright/test';
export declare function chartFixture(providerSymbol?: string, exchange?: string, assetClass?: string, timeframe?: string): {
    symbol: string;
    timeframe: string;
    contextId: string;
    bars: {
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }[];
    analysis: {
        trend: string;
        secondary: string[];
        narrative: string;
        adx: number;
        normalizedAtr: number;
        selectedIndicators: string[];
        selectionReason: string;
        indicators: {
            ema20: number[];
            ema50: number[];
            ema200: number[];
            bollingerUpper: number[];
            bollingerLower: number[];
            rsi: number[];
            macd: number[];
            signal: number[];
            atr: number[];
            adx: number[];
        };
        levels: never[];
        trendlines: never[];
        multiTimeframe: {
            timeframe: string;
            trend: string;
            secondary: never[];
            lastData: string;
        }[];
        conflict: boolean;
        conflictText: string;
        technicalScenario: {
            title: string;
            summary: string;
            timeframe: string;
            primary: string;
            multiTimeframeStatus: string;
            confirmationConditions: {
                id: string;
                description: string;
                timeframe: string;
                source: string;
            }[];
            invalidationConditions: {
                id: string;
                description: string;
                timeframe: string;
                source: string;
            }[];
            supportingSignals: never[];
            conflictingSignals: never[];
            relevantLevels: never[];
            provider: string;
            lastClosedBar: string;
            dataQuality: {
                status: string;
                notes: never[];
            };
        };
    };
    meta: {
        provider: string;
        providerId: string;
        providerSymbol: string;
        assetClass: string;
        exchange: string;
        currency: string;
        lastData: string;
        instrumentId: string;
        completeBarsOnly: boolean;
        status: string;
        demo: boolean;
    };
};
export declare function mockMarket(page: Page): Promise<void>;
