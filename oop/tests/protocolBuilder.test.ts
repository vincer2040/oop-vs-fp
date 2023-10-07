import { ProtocolBuilder } from "../src/protocolBuilder";
import { describe, it, expect } from "vitest";

describe("protocol builder", () => {
    it("can build bulk strings", () => {
        let buf = new ProtocolBuilder()
            .addBulk("this is a bulk string")
            .out()
            .filter((x) => {
                return x !== 0;
            });

        expect(buf).toEqual(Buffer.from("$21\r\nthis is a bulk string\r\n"));
    });

    it("can build arrays", () => {
        let buf = new ProtocolBuilder()
            .addArray(2)
            .addBulk("bulk")
            .addBulk("another")
            .out()
            .filter((x) => {
                return x !== 0;
            });

        expect(buf).toEqual(Buffer.from("*2\r\n$4\r\nbulk\r\n$7\r\nanother\r\n"));
    });
});

