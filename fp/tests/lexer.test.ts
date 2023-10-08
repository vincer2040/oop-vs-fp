import { createLexer, nextToken } from "../src/lexer";
import { describe, it, expect } from "vitest";
import { type Token, TokenType } from "../src/token";

describe("lexer", () => {
    it("can lex bulk string", () => {
        let buf = Buffer.from("$4\r\nbulk\r\n");
        let lexer = createLexer(buf);
        let exps: Token[] = [
            { type: TokenType.BulkType, literal: null },
            { type: TokenType.Len, literal: "4" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Bulk, literal: "bulk" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Eof, literal: null },
        ];
        let i: number, len = exps.length;

        for (i = 0; i < len; ++i) {
            let [l, tok] = nextToken(lexer);
            let exp = exps[i];
            expect(tok.type).toBe(exp.type);
            expect(tok.literal).toBe(exp.literal);
            lexer = l;
        }
    });

    it("can lex arrays", () => {
        const exps: Token[] = [
            { type: TokenType.ArrayType, literal: null },
            { type: TokenType.Len, literal: "2" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.BulkType, literal: null },
            { type: TokenType.Len, literal: "4" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Bulk, literal: "bulk" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.BulkType, literal: null },
            { type: TokenType.Len, literal: "5" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Bulk, literal: "bulk2" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Eof, literal: null },
        ];
        let i: number, len = exps.length;
        let input = Buffer.from("*2\r\n$4\r\nbulk\r\n$5\r\nbulk2\r\n");
        let lexer = createLexer(input);

        for (i = 0; i < len; ++i) {
            let [l, tok] = nextToken(lexer);
            let exp = exps[i];
            expect(tok.type).toBe(exp.type);
            expect(tok.literal).toBe(exp.literal);
            lexer = l;
        }
    });

    it("can lex simple strings", () => {
        const exps: Token[] = [
            { type: TokenType.Simple, literal: "PING" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
        ];
        let i: number, len = exps.length;
        let input = Buffer.from("+PING\r\n");
        let lexer = createLexer(input);

        for (i = 0; i < len; ++i) {
            let [l, tok] = nextToken(lexer);
            let exp = exps[i];
            expect(tok.type).toBe(exp.type);
            expect(tok.literal).toBe(exp.literal);
            lexer = l;
        }
    });
});
