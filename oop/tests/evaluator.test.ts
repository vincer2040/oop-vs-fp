import { Evaluator } from "../src/evaluator";
import { ProtocolBuilder } from "../src/protocolBuilder";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { describe, it, expect } from "vitest";
import { CmdType, type DelCommand, type GetCommand, type SetCommand } from "../src/cmd";

describe("evaluator", () => {
    it("can evaluate set commands", () => {
        let buf = new ProtocolBuilder()
            .addArray(3)
            .addBulk("SET")
            .addBulk("key")
            .addBulk("value")
            .out();
        let l = new Lexer(buf);
        let p = new Parser(l);
        let val = p.parse();
        let cmdcmd = Evaluator.evaluate(val);
        expect(cmdcmd.type).toBe(CmdType.Set);
        let cmd = cmdcmd.cmd as SetCommand;
        expect(cmd?.key).toBe("key");
        expect(cmd?.value).toBe("value");
    });

    it("can evaluate get commands", () => {
        let buf = new ProtocolBuilder()
            .addArray(2)
            .addBulk("GET")
            .addBulk("key")
            .out();
        let l = new Lexer(buf);
        let p = new Parser(l);
        let val = p.parse();
        let cmdcmd = Evaluator.evaluate(val);
        expect(cmdcmd.type).toBe(CmdType.Get);
        let cmd = cmdcmd.cmd as GetCommand;
        expect(cmd?.key).toBe("key");
    });

    it("can evaluate del commands", () => {
        let buf = new ProtocolBuilder()
            .addArray(2)
            .addBulk("DEL")
            .addBulk("key")
            .out();
        let l = new Lexer(buf);
        let p = new Parser(l);
        let val = p.parse();
        let cmdcmd = Evaluator.evaluate(val);
        expect(cmdcmd.type).toBe(CmdType.Del);
        let cmd = cmdcmd.cmd as DelCommand;
        expect(cmd?.key).toBe("key");
    });

    it("can evaluate ping commands", () => {
        let buf = new ProtocolBuilder()
            .addPing()
            .out();
        let l = new Lexer(buf);
        let p = new Parser(l);
        let val = p.parse();
        let cmd = Evaluator.evaluate(val);
        expect(cmd.type).toBe(CmdType.Ping);
    });
});

