import type { Token } from "./token";
import { TokenType } from "./token";
import { TypeBytes } from "./typeBytes";
import { isDigit, isLetter } from "utils";

export type Lexer = {
    readonly input: Buffer,
    readonly pos: number,
    readonly input_len: number,
    readonly ch: number,
}

export function createLexer(input: Buffer): Lexer {
    const len = input.length;
    const pos = len === 0 ? 0 : 1;
    const ch = len === 0 ? 0 : input[0];
    return {
        input: input,
        input_len: len,
        pos: pos,
        ch: ch,
    };
}

export function nextToken(l: Lexer): [Lexer, Token] {
    let tok: Token;
    switch (l.ch) {
        case TypeBytes.Array:
            tok = { type: TokenType.ArrayType, literal: null };
            break;
        case TypeBytes.Bulk:
            tok = { type: TokenType.BulkType, literal: null };
            break;
        case TypeBytes.Simple:
            const preNew = readChar(l);
            const [newLexer, literal] = readString(preNew);
            tok = { type: TokenType.Simple, literal: literal };
            return [newLexer, tok];
        case TypeBytes.RetCar:
            tok = { type: TokenType.RetCar, literal: null };
            break;
        case TypeBytes.NewL:
            tok = { type: TokenType.NewL, literal: null };
            break;
        case TypeBytes.Eof:
            tok = { type: TokenType.Eof, literal: null };
            break;
        default:
            if (isLetter(l.ch)) {
                const [newLexer, literal] = readString(l);
                tok = { type: TokenType.Bulk, literal: literal };
                return [newLexer, tok];
            } else if (isDigit(l.ch)) {
                const [newLexer, literal] = readLen(l);
                tok = { type: TokenType.Len, literal: literal };
                return [newLexer, tok];
            } else {
                tok = { type: TokenType.Illegal, literal: null };
            }
            break;
    }
    const newLexer = readChar(l);
    return [newLexer, tok];
}

function readString(l: Lexer): [Lexer, string] {
    let res = "";
    while (l.ch !== TypeBytes.RetCar) {
        res += String.fromCharCode(l.ch);
        l = readChar(l);
    }
    return [l, res];
}

function readLen(l: Lexer): [Lexer, string] {
    let res = "";
    while (isDigit(l.ch)) {
        res += String.fromCharCode(l.ch);
        l = readChar(l);
    }
    return [l, res];
}

function readChar(l: Lexer): Lexer {
    if (l.pos >= l.input_len) {
        const ch = 0;
        const newPos = l.pos + 1;
        return {
            input: l.input,
            pos: newPos,
            input_len: l.input_len,
            ch: ch,
        };
    } else {
        const ch = l.input[l.pos];
        const newPos = l.pos + 1;
        return {
            input: l.input,
            pos: newPos,
            input_len: l.input_len,
            ch: ch,
        };
    }
}
