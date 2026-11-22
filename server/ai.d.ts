import { z } from "zod";
export declare const IndicatorId: z.ZodEnum<{
    adx: "adx";
    atr: "atr";
    bollinger: "bollinger";
    ema20: "ema20";
    ema200: "ema200";
    ema50: "ema50";
    macd: "macd";
    rsi: "rsi";
}>;
export declare const AgentAction: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"showIndicator">;
    indicator: z.ZodEnum<{
        adx: "adx";
        atr: "atr";
        bollinger: "bollinger";
        ema20: "ema20";
        ema200: "ema200";
        ema50: "ema50";
        macd: "macd";
        rsi: "rsi";
    }>;
    reason: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"hideIndicator">;
    indicator: z.ZodEnum<{
        adx: "adx";
        atr: "atr";
        bollinger: "bollinger";
        ema20: "ema20";
        ema200: "ema200";
        ema50: "ema50";
        macd: "macd";
        rsi: "rsi";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"showTechnicalLevel">;
    levelId: z.ZodString;
    reason: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"clearAIAnnotations">;
}, z.core.$strip>], "type">;
export declare const AgentResponse: z.ZodObject<{
    answer: z.ZodString;
    actions: z.ZodDefault<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"showIndicator">;
        indicator: z.ZodEnum<{
            adx: "adx";
            atr: "atr";
            bollinger: "bollinger";
            ema20: "ema20";
            ema200: "ema200";
            ema50: "ema50";
            macd: "macd";
            rsi: "rsi";
        }>;
        reason: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"hideIndicator">;
        indicator: z.ZodEnum<{
            adx: "adx";
            atr: "atr";
            bollinger: "bollinger";
            ema20: "ema20";
            ema200: "ema200";
            ema50: "ema50";
            macd: "macd";
            rsi: "rsi";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"showTechnicalLevel">;
        levelId: z.ZodString;
        reason: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"clearAIAnnotations">;
    }, z.core.$strip>], "type">>>;
}, z.core.$strip>;
export type AgentResponse = z.infer<typeof AgentResponse>;
export type AgentContext = {
    contextId: string;
    symbol: string;
    timeframe: string;
    mode: string;
    meta: any;
    lastPrice: number;
    barCount: number;
    analysis: any;
    companyIntelligence?: any;
};
export interface AIProvider {
    name: string;
    kind: "llm" | "deterministic";
    generate(question: string, context: AgentContext, signal: AbortSignal): Promise<AgentResponse>;
}
export declare function sanitizeResponse(raw: unknown, ctx: AgentContext): AgentResponse;
export declare function getAIProvider(): AIProvider;
export declare function askAgent(question: string, context: AgentContext): Promise<{
    answer: string;
    actions: ({
        type: "showIndicator";
        indicator: "adx" | "atr" | "bollinger" | "ema20" | "ema200" | "ema50" | "macd" | "rsi";
        reason: string;
    } | {
        type: "hideIndicator";
        indicator: "adx" | "atr" | "bollinger" | "ema20" | "ema200" | "ema50" | "macd" | "rsi";
    } | {
        type: "showTechnicalLevel";
        levelId: string;
        reason: string;
    } | {
        type: "clearAIAnnotations";
    })[];
    provider: string;
    kind: "deterministic" | "llm";
    contextId: string;
} | {
    answer: string;
    actions: ({
        type: "showIndicator";
        indicator: "adx" | "atr" | "bollinger" | "ema20" | "ema200" | "ema50" | "macd" | "rsi";
        reason: string;
    } | {
        type: "hideIndicator";
        indicator: "adx" | "atr" | "bollinger" | "ema20" | "ema200" | "ema50" | "macd" | "rsi";
    } | {
        type: "showTechnicalLevel";
        levelId: string;
        reason: string;
    } | {
        type: "clearAIAnnotations";
    })[];
    provider: string;
    kind: "deterministic";
    contextId: string;
    warning: string;
}>;
