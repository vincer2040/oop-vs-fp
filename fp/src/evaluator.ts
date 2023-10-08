import type { Command } from "./cmd";
import type { Value } from "./value"
import { ValueType } from "./value";
import { CmdType } from "./cmd";

export function evaluate(val: Value): Command {
    switch (val.type) {
        case ValueType.Array: {
            let arr = val.data as Value[];
            if (arr.length === 3) {
                let cmdp = arr[0];
                let keyp = arr[1];
                let valuep = arr[2];
                if (cmdp.type !== ValueType.BulkString) {
                    return { type: CmdType.Inv, cmd: null };
                }
                if (cmdp.data as string !== "SET") {
                    return { type: CmdType.Inv, cmd: null };
                }
                if (keyp.type !== ValueType.BulkString) {
                    return { type: CmdType.Inv, cmd: null };
                }
                if (valuep.type !== ValueType.BulkString) {
                    return { type: CmdType.Inv, cmd: null };
                }

                return { type: CmdType.Set, cmd: { key: keyp.data as string, value: valuep.data as string } };
            } else if (arr.length === 2) {
                let cmdp = arr[0];
                let keyp = arr[1];
                let type: CmdType;
                if (cmdp.type !== ValueType.BulkString) {
                    return { type: CmdType.Inv, cmd: null };
                }
                if (cmdp.data as string === "GET") {
                    type = CmdType.Get;
                } else if (cmdp.data as string === "DEL") {
                    console.log("del");
                    type = CmdType.Del;
                } else {
                    return { type: CmdType.Inv, cmd: null };
                }
                if (keyp.type !== ValueType.BulkString) {
                    return { type: CmdType.Inv, cmd: null };
                }

                return { type, cmd: { key: keyp.data as string } };
            } else {
                return { type: CmdType.Inv, cmd: null };
            }
        };
        case ValueType.Simple: {
            let s = val.data as string;
            if (s === "PING") {
                return { type: CmdType.Ping, cmd: null };
            }
        } break;
        default:
            return { type: CmdType.Inv, cmd: null };
    }
    return { type: CmdType.Inv, cmd: null };
}
