export enum ValueType {
    Invalid,
    Simple,
    BulkString,
    Array,
};

export type Value = {
    type: ValueType;
    data: null | string | Array<Value>;
};
