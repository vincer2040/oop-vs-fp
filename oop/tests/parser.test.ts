import { Parser } from "../src/parser";
import { Lexer } from "../src/lexer";
import { describe, it, expect } from "vitest";
import { Value, ValueType } from "../src/value";

function checkErrors(p: Parser): boolean {
    let errors = p.getErrors();
    if (errors.length > 0) {
        errors.forEach(console.log);
        return false;
    } else {
        return true;
    }
}

describe("parser", () => {
    it("can parse bulk strings", () => {
        let input = Buffer.from("$4\r\nbulk\r\n");
        let lexer = new Lexer(input);
        let parser = new Parser(lexer);

        let value = parser.parse();

        expect(checkErrors(parser)).toBe(true);

        expect(value.type).toBe(ValueType.BulkString);
        expect(value.data).toBe("bulk");
    });
    it("can parse arrays", () => {
        let input = Buffer.from("*2\r\n$4\r\nbulk\r\n$5\r\nbulk2\r\n");
        let lexer = new Lexer(input);
        let parser = new Parser(lexer);

        let value = parser.parse();

        expect(checkErrors(parser)).toBe(true);

        expect(value.type).toBe(ValueType.Array);
        let arr = value.data as Array<Value>;
        expect(arr.length).toBe(2);
        let v1 = arr[0];
        let v2 = arr[1];

        expect(v1.type).toBe(ValueType.BulkString);
        expect(v1.data).toBe("bulk");
        expect(v2.type).toBe(ValueType.BulkString);
        expect(v2.data).toBe("bulk2");
    });
    it("can parse simple strings", () => {
        let input = Buffer.from("+PING\r\n");
        let lexer = new Lexer(input);
        let parser = new Parser(lexer);
        let value = parser.parse();
        expect(value.type).toBe(ValueType.Simple);
        expect(value.data).toBe("PING");
    });
});
