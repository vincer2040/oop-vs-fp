import { createDynamicBuffer, addByte, dbout } from "../src/dynamicBuffer";
import { describe, it, expect } from "vitest"

describe("dynamicBuffer", () => {
    it("can realloc", () => {
        let db = createDynamicBuffer(2);
        db = addByte(db, "a".charCodeAt(0));
        db = addByte(db, "a".charCodeAt(0));
        db = addByte(db, "a".charCodeAt(0));
        db = addByte(db, "a".charCodeAt(0));
        const buf = dbout(db).filter((x) => x !== 0);
        const exp = Buffer.from("aaaa");
        expect(buf).toEqual(exp);
    });
});
