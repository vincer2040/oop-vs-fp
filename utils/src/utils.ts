const Digits = {
    Zero: 48, // 0
    Nine: 57, // 9
} as const;

const Letters = {
    LowerA: 97,
    LowerZ: 122,
    UpperA: 65,
    UpperZ: 90,
} as const;

export function isDigit(ch: number) {
    return Digits.Zero <= ch && ch <= Digits.Nine;
}

export function isLetter(ch: number) {
    return (Letters.LowerA <= ch && ch <= Letters.LowerZ) || (Letters.UpperA <= ch && ch <= Letters.UpperZ);
}
