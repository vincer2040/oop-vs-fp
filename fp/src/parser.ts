import { nextToken, type Lexer } from "./lexer";
import type { Token } from "./token";
import { ValueType, type Value } from "./value";
import { TokenType } from "./token";

export type Parser = {
    l: Lexer,
    cur: Token | undefined,
    peek: Token | undefined,
};

export function createParser(l: Lexer): Parser {
    const p = { l: l, cur: undefined, peek: undefined };
    const loadOne = pNextToken(p);
    return pNextToken(loadOne);
}

export function parse(p: Parser): [Parser, Value] {
    let newP: Parser;
    let val: Value;
    switch (p.cur?.type) {
        case TokenType.BulkType: {
            const [lenP, isLen] = expectPeek(p, TokenType.Len);
            if (!isLen) {
                return [lenP, { type: ValueType.Invalid, data: null }];
            }
            const [endp1, isend1] = expectEnd(lenP);
            if (!isend1) {
                return [endp1, { type: ValueType.Invalid, data: null }];
            }
            if (!curTokenIs(endp1, TokenType.Bulk)) {
                return [endp1, { type: ValueType.Invalid, data: null }];
            }
            const bulk = endp1.cur?.literal as string;
            const [isEnd2, isend2] = expectEnd(endp1);
            if (!isend2) {
                return [isEnd2, { type: ValueType.Invalid, data: null }];
            }
            val = { type: ValueType.BulkString, data: bulk };
            newP = isEnd2;
        } break;
        case TokenType.ArrayType: {
            let arr: Value[] = [];
            let n: Parser;
            const [lenP, isLen] = expectPeek(p, TokenType.Len);
            if (!isLen) {
                return [lenP, { type: ValueType.Invalid, data: null }];
            }
            let len = parseInt(lenP.cur?.literal as string);
            const [endp, isend1] = expectEnd(lenP);
            if (!isend1) {
                return [endp, { type: ValueType.Invalid, data: null }];
            }
            n = endp;
            while (len--) {
                let [nn, v] = parse(n);
                n = nn;
                arr.push(v);
            }
            newP = n;
            val = { type: ValueType.Array, data: arr };
        } break;
        case TokenType.Simple: {
            const ss = p.cur?.literal as string;
            const [endp, isend] = expectEnd(p);
            if (!isend) {
                newP = endp;
                val = { type: ValueType.Invalid, data: null };
            } else {
                newP = endp;
                val = { type: ValueType.Simple, data: ss };
            }
        } break;
        default:
            newP = p;
            val = { type: ValueType.Invalid, data: null };
            break;
    }

    return [newP, val];
}

function curTokenIs(p: Parser, type: TokenType): boolean {
    return p.cur?.type === type;
}

function peekTokenIs(p: Parser, type: TokenType): boolean {
    return p.peek?.type === type;
}

function expectPeek(p: Parser, type: TokenType): [Parser, boolean] {
    if (!peekTokenIs(p, type)) {
        return [p, false];
    } else {
        return [pNextToken(p), true];
    }
}

function expectEnd(p: Parser): [Parser, boolean] {
    const [retcar, isr] = expectPeek(p, TokenType.RetCar);
    if (!isr) {
        return [retcar, isr];
    }
    const [newl, isn] = expectPeek(retcar, TokenType.NewL);
    if (!isn) {
        return [newl, isn];
    }
    return [pNextToken(newl), true];
}

function pNextToken(p: Parser): Parser {
    const cur = p.peek;
    const [newLexer, peek] = nextToken(p.l);
    return {
        l: newLexer,
        cur,
        peek,
    };
}
