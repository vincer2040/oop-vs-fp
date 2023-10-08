import { ProtocolBuilder } from "./protocolBuilder";

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

export type CommandType = {
    type: CmdType,
    cmd: null | SetCommand | GetCommand | DelCommand;
};

export class CommandRunner {
    type: CmdType;
    cmd: SetCommand | GetCommand | DelCommand;
    builder: ProtocolBuilder;
    private static instance: CommandRunner;

    private constructor(cmd: CommandType, builder: ProtocolBuilder) {
        this.type = cmd.type;
        this.cmd = cmd.cmd;
        this.builder = builder;
    }

    public static getInstance(cmd: CommandType, builder: ProtocolBuilder): CommandRunner {
        if (!CommandRunner.instance) {
            CommandRunner.instance = new CommandRunner(cmd, builder);
            return CommandRunner.instance;
        }
        let instance = CommandRunner.instance;
        instance.type = cmd.type;
        instance.cmd = cmd.cmd;
        instance.builder = builder;
        return instance;
    }

    run(map: Map<string, string | undefined | null>): Buffer {
        switch (this.type) {
            case CmdType.Ping:
                this.builder
                    .reset()
                    .addPong();
                break;
            case CmdType.Set:{
                let setCmd = this.cmd as SetCommand;
                map.set(setCmd.key, setCmd.value);
                this.builder
                    .reset()
                    .addOk();
            } break;
            case CmdType.Get:{
                let getCmd = this.cmd as GetCommand;
                let value = map.get(getCmd.key);
                if (!value) {
                    this.builder
                        .reset()
                        .addNone();
                } else {
                    this.builder
                        .reset()
                        .addBulk(value);
                }
            } break;
            case CmdType.Del:{
                let delCmd = this.cmd as DelCommand;
                map.delete(delCmd.key);
                this.builder
                    .reset()
                    .addOk();
            } break;
        }
        return this.builder.out();
    }
}
