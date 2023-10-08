import type { Token } from "./token";
import { TokenType } from "./token";
import { TypeBytes } from "./typeBytes";
import { isDigit, isLetter } from "utils";

export type Lexer = {
    input: Buffer,
    pos: number,
    input_len: number,
    ch: number,
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
    const tok: Token = { type: TokenType.Illegal, literal: null };
    switch (l.ch) {
        case TypeBytes.Array:
            tok.type = TokenType.ArrayType;
            break;
        case TypeBytes.Bulk:
            tok.type = TokenType.BulkType;
            break;
        case TypeBytes.Simple:
            const preNew = readChar(l);
            tok.type = TokenType.Simple;
            const [newLexer, literal] = readString(preNew);
            tok.literal = literal;
            return [newLexer, tok];
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
            if (isLetter(l.ch)) {
                tok.type = TokenType.Bulk;
                const [newLexer, literal] = readString(l);
                tok.literal = literal;
                return [newLexer, tok];
            } else if (isDigit(l.ch)) {
                tok.type = TokenType.Len;
                const [newLexer, literal] = readLen(l);
                tok.literal = literal;
                return [newLexer, tok];
            } else {
                tok.type = TokenType.Illegal;
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
