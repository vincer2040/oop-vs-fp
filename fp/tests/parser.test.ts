import { createLexer } from "../src/lexer";
import { createParser, parse } from "../src/parser";
import { Value, ValueType } from "../src/value";
import { describe, it, expect } from "vitest";

describe("parser", () => {
    it("can parse bulk strings", () => {
        const input = Buffer.from("$4\r\nbulk\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, value] = parse(parser);

        expect(value.type).toBe(ValueType.BulkString);
        expect(value.data).toBe("bulk");
    });
    it("can parse arrays", () => {
        const input = Buffer.from("*2\r\n$4\r\nbulk\r\n$5\r\nbulk2\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, value] = parse(parser);
        expect(value.type).toBe(ValueType.Array);
        const arr = value.data as Value[];
        expect(arr.length).toBe(2);
        const v1 = arr[0];
        const v2 = arr[1];
        expect(v1.type).toBe(ValueType.BulkString);
        expect(v1.data).toBe("bulk");
        expect(v2.type).toBe(ValueType.BulkString);
        expect(v2.data).toBe("bulk2");
    });
    it("can parse simple strings", () => {
        const input = Buffer.from("+PONG\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, val] = parse(parser);
        expect(val.type).toBe(ValueType.Simple);
        expect(val.data).toBe("PONG");
    });
});
