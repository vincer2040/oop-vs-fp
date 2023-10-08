import { createDynamicBuffer, addByte, out } from "../src/dynamicBuffer";
import { describe, it, expect } from "vitest"

describe("dynamicBuffer", () => {
    it("can realloc", () => {
        let db = createDynamicBuffer(2);
        db = addByte(db, "a".charCodeAt(0));
        db = addByte(db, "a".charCodeAt(0));
        db = addByte(db, "a".charCodeAt(0));
        db = addByte(db, "a".charCodeAt(0));
        const buf = out(db).filter((x) => x !== 0);
        const exp = Buffer.from("aaaa");
        expect(buf).toEqual(exp);
    });
});
