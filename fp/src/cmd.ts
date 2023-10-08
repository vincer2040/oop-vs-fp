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

