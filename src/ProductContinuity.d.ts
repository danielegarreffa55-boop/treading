export declare const WATCHLIST_KEY = "financial-analyst.watchlist.v2";
export declare const LEGACY_WATCHLIST_KEY = "financial-analyst.watchlist.v1";
export declare const ONBOARDING_KEY = "financial-analyst.onboarding.v1";
export type ScenarioSnapshot = {
    timeframe: string;
    savedAt: string;
    provider: string;
    lastData: string;
    title: string;
    summary: string;
    confirmation: string[];
    invalidation: string[];
    trend: string;
    quality: string;
};
export type WatchItem = {
    id: string;
    symbol: string;
    providerSymbol?: string;
    exchange: string;
    assetClass: string;
    providerId: string;
    addedAt: string;
    note: string;
    scenario?: ScenarioSnapshot;
    ambiguous?: boolean;
};
type ReadResult = {
    items: WatchItem[];
    warning: string;
};
export declare const instrumentId: (symbol: string, meta: any) => string;
export declare function readWatchlist(storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>): ReadResult;
export declare function makeSnapshot(data: any, timeframe: string): ScenarioSnapshot;
export declare function compareScenario(item: WatchItem, data: any, timeframe: string): {
    status: string;
    title: string;
    summary: string;
    current?: undefined;
} | {
    status: string;
    title: string;
    summary: string;
    current: ScenarioSnapshot;
};
export declare function WatchlistControl({ symbol, meta, data, timeframe, onOpen }: {
    symbol: string;
    meta: any;
    data: any;
    timeframe: string;
    onOpen: () => void;
}): import("react").JSX.Element;
export declare function WatchlistView({ data, symbol, timeframe, onSelect }: {
    data: any;
    symbol: string;
    timeframe: string;
    onSelect: (item: WatchItem) => void;
}): import("react").JSX.Element;
export declare function Onboarding(): import("react").JSX.Element | null;
export declare function PreferencesMenu(): import("react").JSX.Element;
export declare function AppIcon({ name }: {
    name: 'chart' | 'company' | 'watchlist' | 'search';
}): import("react").JSX.Element;
export {};
