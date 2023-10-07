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

    protected addByte(byte: number): boolean {
        if (this.ins === this.cap) {
            const newCapacity = this.cap * 2;
            if (!this.realloc(newCapacity)) {
                return false;
            }
        }

        this.buf[this.ins] = byte;
        this.ins += 1;

        return true;
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

    private realloc(newCapacity: number): boolean {
        let newBuffer: Buffer;
        try {
            newBuffer = Buffer.alloc(newCapacity);
        } catch (_) {
            return false;
        }
        this.buf.copy(newBuffer);
        this.buf = newBuffer;
        this.cap = newCapacity;
        return true;
    }
}
