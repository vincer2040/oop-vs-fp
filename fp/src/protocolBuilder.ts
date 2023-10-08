import { addByte, createDynamicBuffer, dbout, type DynamicBuffer } from "./dynamicBuffer";
import { TypeBytes } from "./typeBytes";

export type ProtocolBuilder = DynamicBuffer;

export function createProtocolBuilder(initialCap?: number): ProtocolBuilder {
    return createDynamicBuffer(initialCap);
}

export function addBulk(b: ProtocolBuilder, bulk: string): ProtocolBuilder {
    const bulkLen = bulk.length;
    const withType = addByte(b, TypeBytes.Bulk);
    const withLen = addLen(withType, bulkLen);
    const withEnd = addEnd(withLen);
    const withStr = addString(withEnd, bulk);
    return addEnd(withStr);
}

export function addArray(b: ProtocolBuilder, len: number): ProtocolBuilder {
    const withType = addByte(b, TypeBytes.Array);
    const withLen = addLen(withType, len);
    return addEnd(withLen);
}

export function out(b: ProtocolBuilder): Buffer {
    return dbout(b);
}

function addLen(b: ProtocolBuilder, len: number): ProtocolBuilder {
    const lenStr = len.toString();
    return addString(b, lenStr);
}

function addString(b: ProtocolBuilder, str: string): ProtocolBuilder {
    const len = str.length;
    if (len === 0) {
        return b;
    }
    const newBuilder = addByte(b, str.charCodeAt(0));
    const newStr = str.substring(1);
    return addString(newBuilder, newStr);
}

function addEnd(b: ProtocolBuilder): ProtocolBuilder {
    const newb = addByte(b, TypeBytes.RetCar);
    return addByte(newb, TypeBytes.NewL);
}
