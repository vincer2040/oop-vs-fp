pub mod builder;
pub mod util;
pub mod token;
pub mod lexer;
pub mod parser;
pub mod value;
pub mod tcp;
pub mod client;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let mut client = client::Client::new("127.0.0.1:6969")?;
    client.connect().await?;
    let mut val: value::Value;
    val = client.set("vince", "is cool").await?;
    println!("{:#?}", val);
    val = client.get("vince").await?;
    println!("{:#?}", val);
    Ok(())
}
