import { Lexer } from "../src/lexer";
import { Token, TokenType } from "../src/token";
import { describe, it, expect } from "vitest";

describe("lexer", () => {
    it("can lex bulk strings", () => {
        const expectedTokens: Token[] = [
            { type: TokenType.BulkType, literal: null },
            { type: TokenType.Len, literal: "4" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Bulk, literal: "bulk" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
            { type: TokenType.Eof, literal: null },
        ];
        let i: number, len = expectedTokens.length;
        let input = Buffer.from("$4\r\nbulk\r\n");
        let lexer = new Lexer(input);

        for (i = 0 ; i < len; ++i) {
            let tok = lexer.nextToken();
            let exp = expectedTokens[i];

            expect(tok.type).toBe(exp.type);
            expect(tok.literal).toBe(exp.literal);
        }
    });

    it("can lex arrays", () => {
        const expectedTokens: Token[] = [
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
        let i: number, len = expectedTokens.length;
        let input = Buffer.from("*2\r\n$4\r\nbulk\r\n$5\r\nbulk2\r\n");
        let lexer = new Lexer(input);

        for (i = 0; i < len; ++i) {
            let tok = lexer.nextToken();
            let exp = expectedTokens[i];
            expect(tok.type).toBe(exp.type);
            expect(tok.literal).toBe(exp.literal);
        }
    });

    it("can lex simple strings", () => {
        const expectedTokens: Token[] = [
            { type: TokenType.Simple, literal: "PING" },
            { type: TokenType.RetCar, literal: null },
            { type: TokenType.NewL, literal: null },
        ];
        let i: number, len = expectedTokens.length;
        let input = Buffer.from("+PING\r\n");
        let lexer = new Lexer(input);

        for (i = 0; i < len; ++i) {
            let tok = lexer.nextToken();
            let exp = expectedTokens[i];
            expect(tok.type).toBe(exp.type);
            expect(tok.literal).toBe(exp.literal);
        }
    });
});
