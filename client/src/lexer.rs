use crate::token::Token;
use crate::util;

pub struct Lexer<'a> {
    input: &'a [u8],
    input_len: usize,
    pos: usize,
    ch: u8,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a [u8]) -> Self {
        let mut l = Self {
            input,
            input_len: input.len(),
            pos: 0,
            ch: 0,
        };
        l.read_char();
        l
    }

    pub fn next_token(&mut self) -> Token {
        let tok: Token;
        match self.ch as char {
            '$' => {
                tok = Token::BulkType;
            }
            '*' => {
                tok = Token::ArrayType;
            }
            '+' => {
                self.read_char();
                let s = self.read_string();
                tok = Token::Simple(s);
                return tok;
            }
            '\r' => {
                tok = Token::Retcar;
            }
            '\n' => {
                tok = Token::Newl;
            }
            '\0' => {
                tok = Token::Eof;
            }
            _ => {
                if util::is_letter(self.ch as char) {
                    let s = self.read_string();
                    tok = Token::Bulk(s);
                    return tok;
                } else if util::is_digit(self.ch as char) {
                    let l = self.read_len();
                    tok = Token::Len(l);
                    return tok;
                } else {
                    tok = Token::Illegal;
                }
            }
        };
        self.read_char();
        return tok;
    }

    fn read_string(&mut self) -> std::rc::Rc<str> {
        let mut res = String::new();
        while self.ch != '\r' as u8 {
            res.push(self.ch as char);
            self.read_char();
        }
        return res.into();
    }

    fn read_len(&mut self) -> std::rc::Rc<str> {
        let mut res = String::new();
        while util::is_digit(self.ch as char) {
            res.push(self.ch as char);
            self.read_char();
        }
        return res.into();
    }

    fn read_char(&mut self) {
        if self.pos >= self.input_len {
            self.ch = 0;
        } else {
            self.ch = self.input[self.pos];
        }
        self.pos += 1;
    }
}

#[cfg(test)]
mod test {

    use crate::lexer::Lexer;
    use crate::builder::Builder;
    use crate::token::Token;

    #[test]
    fn lex_bulk_strings() {
        let buf = Builder::new()
            .add_bulk("bulk")
            .out();

        let mut l = Lexer::new(&buf);

        let exps = [
            Token::BulkType,
            Token::Len("4".into()),
            Token::Retcar,
            Token::Newl,
            Token::Bulk("bulk".into()),
            Token::Retcar,
            Token::Newl,
            Token::Eof,
        ];

        for exp in exps.iter() {
            let tok = l.next_token();
            assert_eq!(*exp, tok);
        }
    }

    #[test]
    fn lex_arrays() {
        let buf = Builder::new()
            .add_arr(2)
            .add_bulk("bulk")
            .add_bulk("bulk2")
            .out();

        let mut l = Lexer::new(&buf);

        let exps = [
            Token::ArrayType,
            Token::Len("2".into()),
            Token::Retcar,
            Token::Newl,
            Token::BulkType,
            Token::Len("4".into()),
            Token::Retcar,
            Token::Newl,
            Token::Bulk("bulk".into()),
            Token::Retcar,
            Token::Newl,
            Token::BulkType,
            Token::Len("5".into()),
            Token::Retcar,
            Token::Newl,
            Token::Bulk("bulk2".into()),
            Token::Retcar,
            Token::Newl,
            Token::Eof,
        ];

        for exp in exps.iter() {
            let tok = l.next_token();
            assert_eq!(*exp, tok);
        }
    }

    #[test]
    fn simple_strings() {
        let buf = Builder::new()
            .add_ping()
            .out();
        let mut l = Lexer::new(&buf);
        let exps = [
            Token::Simple("PING".into()),
            Token::Retcar,
            Token::Newl,
            Token::Eof,
        ];

        for exp in exps.iter() {
            let tok = l.next_token();
            assert_eq!(*exp, tok);
        }
    }
}
