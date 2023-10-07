import { TokenType } from "./token";
import type { Token } from "./token";
import { TypeBytes } from "./typeBytes";
import { isDigit, isLetter } from "utils";

export class Lexer {
    private input: Buffer;
    private pos: number;
    private inputLen: number;
    private ch: number;

    constructor(input: Buffer) {
        this.input = input;
        this.pos = 0;
        this.inputLen = input.length;
        this.ch = 0;
        this.readChar();
    }

    public nextToken(): Token {
        let tok: Token = { type: TokenType.Illegal, literal: null };

        switch (this.ch) {
            case TypeBytes.Array:
                tok.type = TokenType.ArrayType;
                break;
            case TypeBytes.Bulk:
                tok.type = TokenType.BulkType;
                break;
            case TypeBytes.Simple:
                this.readChar();
                tok.type = TokenType.Simple;
                tok.literal = this.readString();
                return tok;
            case TypeBytes.RetCar:
                tok.type = TokenType.RetCar;
                break;
            case TypeBytes.NewL:
                tok.type = TokenType.NewL;
                break;
            case TypeBytes.Eof:
                tok.type = TokenType.Eof;
                break;
            default:
                if (isLetter(this.ch)) {
                    tok.type = TokenType.Bulk;
                    tok.literal = this.readString();
                    return tok;
                } else if (isDigit(this.ch)) {
                    tok.type = TokenType.Len;
                    tok.literal = this.readLen();
                    return tok;
                } else {
                    tok.type = TokenType.Illegal;
                }
                break;
        }

        this.readChar();

        return tok;
    }

    private readLen(): string {
        let res = "";
        while (isDigit(this.ch)) {
            res += String.fromCharCode(this.ch);
            this.readChar();
        }
        return res;
    }

    private readString(): string {
        let res = "";
        while (this.ch != TypeBytes.RetCar) {
            res += String.fromCharCode(this.ch);
            this.readChar();
        }
        return res;
    }

    private readChar() {
        if (this.pos >= this.inputLen) {
            this.ch = 0;
        } else {
            this.ch = this.input[this.pos];
        }
        this.pos += 1;
    }
}
