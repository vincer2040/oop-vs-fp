import { ValueType, type Value } from "./value"
import { CmdType, GetCommand, type CommandType } from "./cmd"

export class Evaluator {
    public static evaluate(val: Value): CommandType {
        let cmd: CommandType = { type: CmdType.Inv, cmd: null };
        switch (val.type) {
            case ValueType.Array: {
                let arr = val.data as Value[];
                if (arr.length === 3) {
                    let cmdp = arr[0];
                    let keyp = arr[1];
                    let valuep = arr[2];
                    if (cmdp.type !== ValueType.BulkString) {
                        return cmd;
                    }
                    if (cmdp.data as string !== "SET") {
                        return cmd;
                    }
                    if (keyp.type !== ValueType.BulkString) {
                        return cmd;
                    }
                    if (valuep.type !== ValueType.BulkString) {
                        return cmd;
                    }

                    cmd.type = CmdType.Set;
                    cmd.cmd = { key: keyp.data as string, value: valuep.data as string };
                } else if (arr.length === 2) {
                    let cmdp = arr[0];
                    let keyp = arr[1];
                    if (cmdp.type !== ValueType.BulkString) {
                        return cmd;
                    }
                    if (cmdp.data as string === "GET") {
                        cmd.type = CmdType.Get;
                    } else if (cmdp.data as string === "DEL") {
                        cmd.type = CmdType.Del;
                    } else {
                        return cmd;
                    }
                    if (keyp.type !== ValueType.BulkString) {
                        return cmd;
                    }

                    cmd.cmd = { key: keyp.data as string } as GetCommand;
                } else {
                    return cmd;
                }
            } break;
            case ValueType.Simple: {
                let s = val.data as string;
                if (s === "PING") {
                    cmd.type = CmdType.Ping;
                }
            } break;
            default:
                break;
        }
        return cmd;
    }
}
