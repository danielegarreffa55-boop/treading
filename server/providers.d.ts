export type InstrumentSearch = {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
    exchangeCode?: string;
    providerId: string;
    providerSymbol: string;
    assetClass: string;
};
export interface FinancialDataProvider {
    id: string;
    search(query: string): Promise<InstrumentSearch[]>;
    chart(symbol: string, options: any): Promise<any>;
}
export declare class YahooProvider implements FinancialDataProvider {
    id: string;
    private client;
    search(q: string): Promise<{
        symbol: any;
        name: any;
        exchange: any;
        type: any;
        exchangeCode: any;
        providerId: string;
        providerSymbol: any;
        assetClass: string;
    }[]>;
    chart(symbol: string, options: any): Promise<import("yahoo-finance2/modules/chart").ChartResultObject>;
}
export declare const dataProvider: FinancialDataProvider;
export declare const optionalProviders: {
    twelveData: {
        configured: boolean;
        status: string;
    };
    eodhd: {
        configured: boolean;
        status: string;
    };
};
