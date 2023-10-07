import { DynamicBuffer } from "../src/dynamicBuffer";
import { describe, it, expect } from "vitest";

describe('dynamic buffer', () => {
    it('can realloc', () => {

        let dynamicBuf = new DynamicBuffer(2);
        expect(dynamicBuf.capacity()).toBe(2);
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        expect(dynamicBuf.capacity()).toBe(4);
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));
        // @ts-ignore:
        dynamicBuf.addByte("a".charCodeAt(0));

        let buf = dynamicBuf.out();

        expect(buf).toEqual(Buffer.from("aaaaaaaa"));
    })
});
