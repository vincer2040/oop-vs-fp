
pub fn is_digit(ch: char) -> bool {
    return '0' <= ch && ch <= '9';
}

pub fn is_letter(ch: char) -> bool {
    return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z');
}
