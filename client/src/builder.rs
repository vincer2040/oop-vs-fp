pub struct Builder {
    buf: Vec<u8>,
}

impl Builder {
    pub fn new() -> Self {
        Self { buf: Vec::new() }
    }

    pub fn add_bulk(mut self, bulk: &str) -> Self {
        self.add_byte('$' as u8);
        self.add_len(bulk.len());
        self.add_end();
        self.add_string(bulk);
        self.add_end();
        self
    }

    pub fn add_arr(mut self, len: usize) -> Self {
        self.add_byte('*' as u8);
        self.add_len(len);
        self.add_end();
        self
    }

    pub fn add_ping(mut self) -> Self {
        self.add_byte('+' as u8);
        self.add_byte('P' as u8);
        self.add_byte('I' as u8);
        self.add_byte('N' as u8);
        self.add_byte('G' as u8);
        self.add_end();
        self
    }

    pub fn out(self) -> Vec<u8> {
        self.buf
    }

    fn add_len(&mut self, len: usize) {
        let len_str = len.to_string();

        for ch in len_str.chars() {
            self.add_byte(ch as u8);
        }
    }

    fn add_string(&mut self, string: &str) {
        for ch in string.chars() {
            self.buf.push(ch as u8);
        }
    }

    fn add_end(&mut self) {
        self.add_byte('\r' as u8);
        self.add_byte('\n' as u8);
    }

    fn add_byte(&mut self, byte: u8) {
        self.buf.push(byte);
    }
}

#[cfg(test)]
mod test {
    use super::Builder;

    #[test]
    fn bulk_strings() {
        let buf = Builder::new().add_bulk("bulk").out();
        assert_eq!(
            buf,
            [
                '$' as u8, '4' as u8, '\r' as u8, '\n' as u8, 'b' as u8, 'u' as u8, 'l' as u8,
                'k' as u8, '\r' as u8, '\n' as u8
            ]
        );
    }

    #[test]
    fn arrays() {
        let buf = Builder::new()
            .add_arr(2)
            .add_bulk("bulk")
            .add_bulk("bulk2")
            .out();
        assert_eq!(
            buf,
            [
                '*' as u8, '2' as u8, '\r' as u8, '\n' as u8, '$' as u8, '4' as u8, '\r' as u8,
                '\n' as u8, 'b' as u8, 'u' as u8, 'l' as u8, 'k' as u8, '\r' as u8, '\n' as u8,
                '$' as u8, '5' as u8, '\r' as u8, '\n' as u8, 'b' as u8, 'u' as u8, 'l' as u8,
                'k' as u8, '2' as u8, '\r' as u8, '\n' as u8
            ]
        );
    }
}
