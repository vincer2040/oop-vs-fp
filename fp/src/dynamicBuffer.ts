const DEFAULT_INITIAL_CAPACITY: number = 32;

export type DynamicBuffer = {
    buffer: Buffer,
    ins: number,
    cap: number,
};

export function createDynamicBuffer(initialCapacity?: number): DynamicBuffer {
    const cap = initialCapacity || DEFAULT_INITIAL_CAPACITY;
    const buffer = Buffer.alloc(cap);
    const ins = 0;
    return { buffer, ins, cap };
}

export function addByte(db: DynamicBuffer, byte: number): DynamicBuffer {
    const ins = db.ins;
    const cap = db.cap;
    if (ins === cap) {
        const newCap = cap * 2;
        const newDb = realloc(db, newCap);
        return addByte(newDb, byte);
    } else {
        const buffer = Buffer.alloc(cap);
        db.buffer.copy(buffer);
        buffer[ins] = byte;
        return { buffer, ins: ins + 1, cap };
    }
}

export function out(db: DynamicBuffer): Buffer {
    return db.buffer;
}

function realloc(old: DynamicBuffer, newCapacity: number): DynamicBuffer {
    const buffer = Buffer.alloc(newCapacity);
    const ins = old.ins;
    const cap = newCapacity;
    old.buffer.copy(buffer);
    return { buffer, ins, cap };
}
