import { type Bar } from "./analysis.js";
export declare function cacheSet(key: string, value: any, ttl?: number): void;
export declare function cacheGet(key: string): any;
export declare function aggregate4h(rows: any[]): Bar[];
