import { describe, it, expect } from "vitest"
import { createProtocolBuilder, addBulk, out, addArray } from "../src/protocolBuilder";

describe("protocol builder", () => {
    it("can build bulk strings", () => {
        let builder = createProtocolBuilder();
        builder = addBulk(builder, "bulk");
        const buf = out(builder).filter(x => x !== 0)
        const exp = Buffer.from("$4\r\nbulk\r\n");
        expect(buf).toEqual(exp);
    });
    it("can build arrays", () => {
        let builder = createProtocolBuilder();
        builder = addArray(builder, 2);
        builder = addBulk(builder, "bulk");
        builder = addBulk(builder, "bulk2");
        const buf = out(builder).filter(x => x !== 0);
        const exp = Buffer.from("*2\r\n$4\r\nbulk\r\n$5\r\nbulk2\r\n")
        expect(buf).toEqual(exp);
    });
    it.todo("can build simple strings", () => {
    });
});
