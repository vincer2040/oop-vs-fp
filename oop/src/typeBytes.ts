
export const TypeBytes =  {
    Array: 42, // *
    Bulk: 36, // $
    Simple: 43, // +
    Error: 45, // -
    RetCar: 13, // \r
    NewL: 10, // \n
    Eof: 0,
} as const;

export type TypeByteName = keyof typeof TypeBytes;

export type TypeByte = typeof TypeBytes[TypeByteName];
