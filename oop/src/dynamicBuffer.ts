const DEFAULT_INITIAL_CAPACITY: number = 32;

export class DynamicBuffer {
    private buf: Buffer;
    private ins: number;
    private cap: number;

    constructor(initialCapactiy?: number) {
        this.ins = 0;
        this.cap = initialCapactiy || DEFAULT_INITIAL_CAPACITY;
        this.buf = Buffer.alloc(this.cap);
    }

    protected addByte(byte: number) {
        if (this.ins === this.cap) {
            const newCapacity = this.cap * 2;
            this.realloc(newCapacity);
        }

        this.buf[this.ins] = byte;
        this.ins += 1;
    }

    public reset(): void {
    }

    public out(): Buffer {
        return this.buf;
    }

    public capacity(): number {
        return this.cap;
    }

    public len(): number {
        return this.ins;
    }

    private realloc(newCapacity: number) {
        let newBuffer = Buffer.alloc(newCapacity);
        this.buf.copy(newBuffer);
        this.buf = newBuffer;
        this.cap = newCapacity;
    }
}
