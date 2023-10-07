import { Lexer } from "./lexer";
import { Token, TokenType, tokenTypeTostring } from "./token";
import type { Value } from "./value";
import { ValueType } from "./value";

export class Parser {
    private l: Lexer;
    private cur: Token;
    private peek: Token;
    private errors: string[];

    constructor(lexer: Lexer) {
        this.l = lexer;
        this.errors = [];
        this.nextToken();
        this.nextToken();
    }

    public parse(): Value {
        let value: Value = { type: ValueType.Invalid, data: null };
        switch (this.cur.type) {
            case TokenType.BulkType: {
                if (!this.expectPeek(TokenType.Len)) {
                    return value;
                }

                if (!this.expectEnd()) {
                    return value;
                }

                if (!this.curTokis(TokenType.Bulk)) {
                    return value;
                }

                let str = this.cur.literal;

                if (!this.expectEnd()) {
                    return value;
                }

                value.type = ValueType.BulkString;
                value.data = str;
            } break;
            case TokenType.ArrayType:
                if (!this.expectPeek(TokenType.Len)) {
                    return value;
                }

                let i: number, len = parseInt(this.cur.literal);

                if (!this.expectEnd()) {
                    return value;
                }

                let arr: Value[] = [];

                for (i = 0; i < len; ++i) {
                    let v = this.parse();
                    arr.push(v);
                }

                value.type = ValueType.Array;
                value.data = arr;
                break;
            case TokenType.Simple:{
                let simple = this.cur.literal;

                if (!this.expectEnd()) {
                    return value;
                }

                value.type = ValueType.Simple;
                value.data = simple;
            } break;
        }
        return value;
    }

    public getErrors(): string[] {
        return this.errors;
    }

    private curTokis(tokType: TokenType): boolean {
        if (this.cur.type !== tokType) {
            let err = `expected cur token to be ${tokenTypeTostring(tokType)}, got ${tokenTypeTostring(this.cur.type)} instead`;
            this.errors.push(err);
            return false;
        }
        return true;
    }

    private peekTokIs(tokType: TokenType): boolean {
        return this.peek.type === tokType;
    }

    private expectPeek(tokType: TokenType): boolean {
        if (this.peekTokIs(tokType)) {
            this.nextToken();
            return true;
        }
        this.peekError(tokType);
        return false;
    }

    private expectEnd(): boolean {
        if (!this.expectPeek(TokenType.RetCar)) {
            return false;
        }
        if (!this.expectPeek(TokenType.NewL)) {
            return false;
        }
        this.nextToken();
        return true;
    }

    private peekError(tokType: TokenType): void {
        let err = `expected peek token to be ${tokenTypeTostring(tokType)}, got ${tokenTypeTostring(this.peek.type)} instead`;
        this.errors.push(err);
    }

    private nextToken(): void {
        this.cur = this.peek;
        this.peek = this.l.nextToken();
    }
}
