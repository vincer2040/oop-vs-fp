
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

export function tokenTypeTostring(tokType: TokenType): string {
    switch (tokType) {
        case TokenType.Illegal:
            return "Illegal";
        case TokenType.Simple:
            return "Simple";
        case TokenType.BulkType:
            return "BulkType";
        case TokenType.ArrayType:
            return "ArrayType";
        case TokenType.Len:
            return "Len";
        case TokenType.Bulk:
            return "Bulk";
        case TokenType.RetCar:
            return "RetCar";
        case TokenType.NewL:
            return "NewL";
        case TokenType.Eof:
            return "Eof";
        default:
            return "Illegal";
    }
}
