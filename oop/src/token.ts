
export enum TokenType {
    Illegal,
    Simple,
    BulkType,
    ArrayType,
    Len,
    Bulk,
    RetCar,
    NewL,
    Eof,
};

export type Token = {
    type: TokenType;
    literal: string | null;
};
