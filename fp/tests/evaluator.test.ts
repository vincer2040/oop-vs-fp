import { createLexer } from "../src/lexer";
import { createParser, parse } from "../src/parser";
import { evaluate } from "../src/evaluator";
import { describe, it, expect } from "vitest"
import { CmdType, type SetCommand, type GetCommand } from "../src/cmd";

describe("evaluator", () => {
    it("can evaluate set commands", () => {
        const input = Buffer.from("*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, value] = parse(parser);
        const cmd = evaluate(value);
        expect(cmd.type).toBe(CmdType.Set);
        const setCmd = cmd.cmd as SetCommand;
        expect(setCmd.key).toBe("key");
        expect(setCmd.value).toBe("value");
    });
    it("can evaluate get commands", () => {
        const input = Buffer.from("*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, value] = parse(parser);
        const cmd = evaluate(value);
        expect(cmd.type).toBe(CmdType.Get);
        const setCmd = cmd.cmd as GetCommand;
        expect(setCmd.key).toBe("key");
    });
    it("can evaluate del commands", () => {
        const input = Buffer.from("*2\r\n$3\r\nDEL\r\n$3\r\nkey\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, value] = parse(parser);
        const cmd = evaluate(value);
        expect(cmd.type).toBe(CmdType.Del);
        const setCmd = cmd.cmd as GetCommand;
        expect(setCmd.key).toBe("key");
    });
    it("can evaluate ping commands", () => {
        const input = Buffer.from("+PING\r\n");
        const lexer = createLexer(input);
        const parser = createParser(lexer);
        const [_, val] = parse(parser);
        const cmd = evaluate(val);
        expect(cmd.type).toBe(CmdType.Ping);
    });
});
