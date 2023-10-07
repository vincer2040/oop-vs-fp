use crate::{tcp::TcpClient, value::Value, lexer::Lexer, parser::Parser, builder::Builder};


pub struct Client {
    tcp: TcpClient,
}

impl Client {
    pub fn new(addr: &str) -> anyhow::Result<Self> {
        Ok(Self {
            tcp: TcpClient::new(addr)?,
        })
    }

    pub async fn connect(&mut self) -> anyhow::Result<()> {
        self.tcp.connect().await
    }


    pub async fn ping(&mut self) -> anyhow::Result<Value> {
        let buf = Builder::new()
            .add_ping()
            .out();
        self.tcp.send(&buf).await?;
        let mut read_buf = Vec::with_capacity(4096);
        self.tcp.recv(&mut read_buf).await?;
        Ok(Self::parse(&read_buf))
    }

    pub async fn set(&mut self, key: &str, value: &str) -> anyhow::Result<Value> {
        let buf = Builder::new()
            .add_arr(3)
            .add_bulk("SET")
            .add_bulk(key)
            .add_bulk(value)
            .out();
        self.tcp.send(&buf).await?;
        let mut read_buf = Vec::with_capacity(4096);
        self.tcp.recv(&mut read_buf).await?;
        Ok(Self::parse(&read_buf))
    }

    pub async fn get(&mut self, key: &str) -> anyhow::Result<Value> {
        let buf = Builder::new()
            .add_arr(2)
            .add_bulk("GET")
            .add_bulk(key)
            .out();
        self.tcp.send(&buf).await?;
        let mut read_buf = Vec::with_capacity(4096);
        self.tcp.recv(&mut read_buf).await?;
        Ok(Self::parse(&read_buf))
    }

    pub async fn del(&mut self, key: &str) -> anyhow::Result<Value> {
        let buf = Builder::new()
            .add_arr(2)
            .add_bulk("DEL")
            .add_bulk(key)
            .out();
        self.tcp.send(&buf).await?;
        let mut read_buf = Vec::with_capacity(4096);
        self.tcp.recv(&mut read_buf).await?;
        Ok(Self::parse(&read_buf))
    }

    fn parse(input: &[u8]) -> Value {
        let mut l = Lexer::new(input);
        let mut p = Parser::new(&mut l);
        p.parse()
    }
}


