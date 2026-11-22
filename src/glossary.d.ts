export type GlossaryEntry = {
    term: string;
    short: string;
    detail: string;
    formula?: string;
    example: string;
    limits: string;
};
export declare const glossary: GlossaryEntry[];
export declare const findGlossary: (label: string) => GlossaryEntry | undefined;
