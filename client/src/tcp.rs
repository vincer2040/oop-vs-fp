pub struct TcpClient {
    address: std::net::SocketAddr,
    stream: Option<tokio::net::TcpStream>,
}

impl TcpClient {
    pub fn new(addr: &str) -> anyhow::Result<Self> {
        let address: std::net::SocketAddr = addr.parse()?;
        Ok(Self {
            address,
            stream: None,
        })
    }

    pub async fn connect(&mut self) -> anyhow::Result<()> {
        let socket = tokio::net::TcpSocket::new_v4()?;
        let stream = socket.connect(self.address).await?;
        self.stream = Some(stream);
        Ok(())
    }

    pub async fn send(&mut self, data: &[u8]) -> anyhow::Result<()> {
        match &self.stream {
            Some(stream) => {
                loop {
                    stream.writable().await?;

                    match stream.try_write(data) {
                        Ok(_) => {
                            break;
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                            continue;
                        }
                        Err(e) => {
                            return Err(e.into());
                        }
                    }
                }
            }
            None => {
                return Err(anyhow::anyhow!("socket is not connected"));
            }
        };
        Ok(())
    }

    pub async fn recv(&mut self, out: &mut Vec<u8>) -> anyhow::Result<usize> {
        let res: usize;
        match &self.stream {
            Some(stream) => loop {
                stream.readable().await?;
                match stream.try_read_buf(out) {
                    Ok(0) => {
                        res = 0;
                        break;
                    }
                    Ok(n) => {
                        res = n;
                        break;
                    }
                    Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                        continue;
                    }
                    Err(e) => {
                        return Err(e.into());
                    }
                }
            },
            None => return Err(anyhow::anyhow!("no connection to the database")),
        }

        Ok(res)
    }
}
