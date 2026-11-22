import { z } from 'zod';
import type { Bar } from './analysis.js';
export declare const cryptoPairs: readonly [{
    readonly symbol: 'BTC/USDT';
    readonly baseAsset: 'BTC';
    readonly quoteAsset: 'USDT';
}, {
    readonly symbol: 'ETH/USDT';
    readonly baseAsset: 'ETH';
    readonly quoteAsset: 'USDT';
}, {
    readonly symbol: 'BTC/EUR';
    readonly baseAsset: 'BTC';
    readonly quoteAsset: 'EUR';
}, {
    readonly symbol: 'ETH/EUR';
    readonly baseAsset: 'ETH';
    readonly quoteAsset: 'EUR';
}, {
    readonly symbol: 'SOL/USDT';
    readonly baseAsset: 'SOL';
    readonly quoteAsset: 'USDT';
}];
export type CryptoPair = (typeof cryptoPairs)[number];
export declare const CryptoTimeframe: z.ZodEnum<{
    "15m": "15m";
    "1D": "1D";
    "1W": "1W";
    "1h": "1h";
    "1m": "1m";
    "4h": "4h";
    "5m": "5m";
}>;
export declare function normalizePair(value: string): string;
export declare function findCryptoPair(value: string): {
    readonly symbol: 'BTC/USDT';
    readonly baseAsset: 'BTC';
    readonly quoteAsset: 'USDT';
} | {
    readonly symbol: 'ETH/USDT';
    readonly baseAsset: 'ETH';
    readonly quoteAsset: 'USDT';
} | {
    readonly symbol: 'BTC/EUR';
    readonly baseAsset: 'BTC';
    readonly quoteAsset: 'EUR';
} | {
    readonly symbol: 'ETH/EUR';
    readonly baseAsset: 'ETH';
    readonly quoteAsset: 'EUR';
} | {
    readonly symbol: 'SOL/USDT';
    readonly baseAsset: 'SOL';
    readonly quoteAsset: 'USDT';
} | undefined;
export declare function binanceSymbol(value: string): string;
export declare function normalizeKlines(raw: unknown, now?: number): {
    closedBars: Bar[];
    currentBar: Bar | undefined;
    lastCloseTime: number | undefined;
};
export declare function cryptoCacheKey(pair: string, timeframe: string, dataType?: string): string;
export declare function loadBinanceSpot(pairValue: string, timeframeValue: string, fetcher?: typeof fetch): Promise<{
    closedBars: Bar[];
    currentBar: Bar | undefined;
    lastCloseTime: number | undefined;
    meta: {
        provider: string;
        providerId: string;
        assetClass: string;
        baseAsset: "BTC" | "ETH" | "SOL";
        quoteAsset: "EUR" | "USDT";
        currency: "EUR" | "USDT";
        exchange: string;
        marketType: string;
        instrumentType: string;
        marketStatus: string;
        volumeUnit: "BTC" | "ETH" | "SOL";
        timezone: string;
        completeBarsOnly: boolean;
        status: string;
        demo: boolean;
        streamUrl: string;
    };
}>;
export declare function searchCrypto(query: string): {
    symbol: "BTC/EUR" | "BTC/USDT" | "ETH/EUR" | "ETH/USDT" | "SOL/USDT";
    name: string;
    exchange: string;
    type: string;
    assetClass: string;
    baseAsset: "BTC" | "ETH" | "SOL";
    quoteAsset: "EUR" | "USDT";
    marketType: string;
    provider: string;
}[];
