import { DynamicBuffer } from "./dynamicBuffer";
import { TypeBytes } from "./typeBytes";
import type { TypeByte } from "./typeBytes";

export class ProtocolBuilder extends DynamicBuffer {

    constructor(initialCapacity?: number) {
        super(initialCapacity);
    }

    public addArray(len: number): ProtocolBuilder {
        this.addTypeByte(TypeBytes.Array);
        this.addLen(len);
        this.addEnd();
        return this;
    }

    public addBulk(bulk: string): ProtocolBuilder {
        let len = bulk.length;
        this.addTypeByte(TypeBytes.Bulk);
        this.addLen(len);
        this.addEnd();
        this.addString(bulk);
        this.addEnd();
        return this;
    }

    public addError(err: string): ProtocolBuilder {
        this.addTypeByte(TypeBytes.Error);
        this.addString(err);
        this.addEnd();
        return this;
    }

    public addPing(): ProtocolBuilder {
        this.addTypeByte(TypeBytes.Simple);
        this.addString("PING");
        this.addEnd();
        return this;
    }

    public addPong(): ProtocolBuilder {
        this.addTypeByte(TypeBytes.Simple);
        this.addString("PONG");
        this.addEnd();
        return this;
    }

    public addOk(): ProtocolBuilder {
        this.addTypeByte(TypeBytes.Simple);
        this.addString("OK");
        this.addEnd();
        return this;
    }

    public addNone(): ProtocolBuilder {
        this.addTypeByte(TypeBytes.Simple);
        this.addString("NONE");
        this.addEnd();
        return this;
    }

    public reset(): ProtocolBuilder {
        this.memset0();
        return this;
    }

    private addLen(len: number) {
        let lenToString = len.toString();
        let lenOfLenString = lenToString.length;
        let i: number;
        for (i = 0; i < lenOfLenString; ++i) {
            this.addByte(lenToString.charCodeAt(i));
        }
    }

    private addString(str: string) {
        let len = str.length;
        let i: number;
        for (i = 0; i < len; ++i) {
            this.addByte(str.charCodeAt(i));
        }
    }

    private addEnd(): void {
        this.addTypeByte(TypeBytes.RetCar);
        this.addTypeByte(TypeBytes.NewL);
    }

    private addTypeByte(typeByte: TypeByte): void {
        this.addByte(typeByte);
    }
}
