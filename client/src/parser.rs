use crate::lexer::Lexer;
use crate::token::Token;
use crate::value::Value;

pub struct Parser<'a> {
    l: &'a mut Lexer<'a>,
    cur: Token,
    peek: Token,
}

impl<'a> Parser<'a> {
    pub fn new(lexer: &'a mut Lexer<'a>) -> Self {
        let cur = lexer.next_token();
        let peek = lexer.next_token();
        Self {
            l: lexer,
            cur,
            peek,
        }
    }

    pub fn parse(&mut self) -> Value {
        match &self.cur {
            Token::BulkType => {
                if let Token::Len(_) = self.peek {
                    self.next_token();
                } else {
                    return Value::Invalid;
                }
                if !self.expect_end() {
                    return Value::Invalid;
                }
                let bulk = if let Token::Bulk(s) = self.cur.clone() {
                    s
                } else {
                    return Value::Invalid;
                };
                if !self.expect_end() {
                    return Value::Invalid;
                }
                Value::BulkString(bulk.clone())
            }

            Token::ArrayType => {
                let len: usize = if let Token::Len(l) = self.peek.clone() {
                    self.next_token();
                    l.parse().unwrap()
                } else {
                    return Value::Invalid;
                };

                if !self.expect_end() {
                    return Value::Invalid;
                }

                let mut arr = Vec::with_capacity(len);

                for _ in 0..len {
                    let v = self.parse();
                    arr.push(v);
                }
                Value::Array(arr)
            }

            Token::Simple(s) => {
                let ss = s.clone();
                if !self.expect_end() {
                    return Value::Invalid;
                }
                Value::Simple(ss)
            }
            _ => todo!(),
        }
    }

    fn expect_end(&mut self) -> bool {
        if !self.expect_peek(Token::Retcar) {
            return false;
        }
        if !self.expect_peek(Token::Newl) {
            return false;
        }
        self.next_token();
        return true;
    }

    fn expect_peek(&mut self, tok: Token) -> bool {
        if self.peek_tok_is(tok) {
            self.next_token();
            return true;
        }
        return false;
    }

    fn peek_tok_is(&self, tok: Token) -> bool {
        return self.peek == tok;
    }

    fn next_token(&mut self) {
        self.cur = self.peek.clone();
        self.peek = self.l.next_token();
    }
}

#[cfg(test)]
mod test {
    use crate::{builder::Builder, lexer::Lexer, value::Value};

    use super::Parser;

    #[test]
    fn bulk_strings() {
        let buf = Builder::new().add_bulk("bulk").out();
        let mut l = Lexer::new(&buf);
        let mut p = Parser::new(&mut l);
        let val = p.parse();
        assert_eq!(val, Value::BulkString("bulk".into()));
    }

    #[test]
    fn arrays() {
        let buf = Builder::new()
            .add_arr(2)
            .add_bulk("bulk")
            .add_bulk("bulk2")
            .out();
        let mut l = Lexer::new(&buf);
        let mut p = Parser::new(&mut l);
        let val = p.parse();
        match val {
            Value::Array(arr) => {
                let v1 = &arr[0];
                let v2 = &arr[1];
                assert_eq!(*v1, Value::BulkString("bulk".into()));
                assert_eq!(*v2, Value::BulkString("bulk2".into()));
            }
            _ => panic!("{:#?} is not array", val),
        }
    }

    #[test]
    fn simple_strings() {
        let buf = Builder::new().add_ping().out();
        let mut l = Lexer::new(&buf);
        let mut p = Parser::new(&mut l);
        let val = p.parse();
        assert_eq!(val, Value::Simple("PING".into()));
    }
}
