import { addBulk, addNone, addOk, addPong, createProtocolBuilder, out } from "./protocolBuilder";

export enum CmdType {
    Inv,
    Ping,
    Set,
    Get,
    Del,
};

export type SetCommand = {
    key: string,
    value: string,
};

export type GetCommand = {
    key: string,
};

export type DelCommand = {
    key: string,
};

export type Command = {
    type: CmdType,
    cmd: null | SetCommand | GetCommand | DelCommand;
};

export function runCmd(cmd: Command, db: Map<string, string | undefined | null>): Buffer {
    switch (cmd.type) {
        case CmdType.Ping: {
            const builder = createProtocolBuilder();
            const withPing = addPong(builder);
            return out(withPing);
        };
        case CmdType.Set: {
            const setCommand = cmd.cmd as SetCommand;
            const key = setCommand.key;
            const value = setCommand.value;
            db.set(key, value);
            const builder = createProtocolBuilder();
            const withOk = addOk(builder);
            return out(withOk);
        };
        case CmdType.Get: {
            const getCommand = cmd.cmd as GetCommand;
            const key = getCommand.key;
            const val = db.get(key);
            const builder = createProtocolBuilder();
            if (!val) {
                const withNone = addNone(builder);
                return out(withNone);
            } else {
                const withVal = addBulk(builder, val);
                return out(withVal);
            }
        }
        case CmdType.Del: {
            const delCommand = cmd.cmd as DelCommand;
            const key = delCommand.key;
            db.delete(key);
            const builder = createProtocolBuilder();
            const withOk = addOk(builder);
            return out(withOk);
        }
        default:
            return Buffer.from("-Invalid\r\n");
    }
}

