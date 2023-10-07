use tcp::TcpClient;
use builder::Builder;

pub mod builder;
pub mod util;
pub mod token;
pub mod lexer;
pub mod parser;
pub mod value;
pub mod tcp;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let mut client = TcpClient::new("127.0.0.1:6969")?;
    client.connect().await?;

    let send_buf = Builder::new()
        .add_bulk("hello")
        .out();

    client.send(&send_buf).await?;

    let mut buf = Vec::with_capacity(4096);

    client.recv(&mut buf).await?;

    println!("{:#?}", buf);
    Ok(())
}
