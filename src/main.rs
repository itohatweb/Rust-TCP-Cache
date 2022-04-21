mod models;

use std::{io::Cursor, sync::Arc};

use bytes::{Buf, BytesMut};
use models::{Cache, Data};
use simple_process_stats::ProcessStats;
use std::net::SocketAddr;
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    net::{TcpListener, TcpStream},
};

use crate::models::Stats;

fn main() {
    let cache = Arc::new(Cache::new());

    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4)
        .enable_all()
        .build()
        .expect("Failed to build Tokio Runtime");

    rt.block_on(async {
        let listener = TcpListener::bind("127.0.0.1:6379")
            .await
            .expect("Failed to bind address");

        loop {
            let (socket, address) = listener.accept().await.unwrap();
            let cache = Arc::clone(&cache);
            tokio::spawn(async move {
                if let Err(err) = process(socket, address, cache).await {
                    println!("{}", err);
                }
            });
        }
    });
}

async fn process(socket: TcpStream, address: SocketAddr, cache: Arc<Cache>) -> Result<(), Error> {
    let mut connection = Connection::new(socket);

    let timed = tokio::time::timeout(std::time::Duration::from_secs(10), async {
        if let Ok(Some(frame)) = connection.read_frame().await {
            if let Data::Identify(identify) = frame.data {
                return !identify.user.is_empty();
            }
        }

        false
    })
    .await;

    match timed {
        Err(_) | Ok(false) => return Err(Error::Unauthorized(address.to_string())),
        Ok(true) => {
            connection.send_frame(&Frame::new(0, Data::Hello)).await?;
        }
    }

    loop {
        match connection.read_frame().await {
            Ok(Some(frame)) => {
                dbg!(&frame);

                match frame.data {
                    Data::GetStats => {
                        let process_stats = ProcessStats::get().await.unwrap();

                        connection
                            .send_frame(&Frame::new(
                                frame.seq,
                                Data::Stats(Stats {
                                    guilds: cache.guilds.len(),
                                    used_memory: process_stats.memory_usage_bytes as f64
                                        / 1_000_000.0,
                                }),
                            ))
                            .await?
                    }
                    Data::CacheGuild(guild) => {
                        cache.guilds.insert(guild.id, guild);
                        dbg!("INSRTING");
                        connection
                            .send_frame(&Frame::new(frame.seq, Data::Hello))
                            .await?
                    }
                    _ => connection.send_frame(&frame).await?,
                }
            }
            Ok(None) => {
                println!(
                    "The connection from {} has been closed",
                    address.to_string()
                );

                return Ok(());
            }
            Err(e) => {
                return Err(e);
            }
        }
    }
}

#[derive(Debug)]
pub struct Connection {
    buffer: BytesMut,
    stream: TcpStream,
}

impl Connection {
    pub fn new(stream: TcpStream) -> Connection {
        Connection {
            buffer: BytesMut::with_capacity(4096),
            stream,
        }
    }

    pub async fn read_frame(&mut self) -> Result<Option<Frame>, Error> {
        loop {
            if let Some(frame) = self.parse_frame()? {
                return Ok(Some(frame));
            }

            if 0 == self.stream.read_buf(&mut self.buffer).await? {
                if self.buffer.is_empty() {
                    return Ok(None);
                } else {
                    return Err(Error::ConnectionReset);
                }
            }
        }
    }

    fn parse_frame(&mut self) -> Result<Option<Frame>, Error> {
        let mut buf = Cursor::new(&self.buffer[..]);

        match Frame::check(&mut buf) {
            true => {
                let len = buf.position() as usize;

                buf.set_position(0);
                let frame = Frame::parse(&mut buf)?;

                self.buffer.advance(len);

                Ok(Some(frame))
            }
            false => Ok(None),
        }
    }

    async fn send_frame(&mut self, frame: &Frame) -> Result<(), Error> {
        let mut buff = Vec::new();
        ciborium::ser::into_writer(&frame.data, &mut buff)?;

        let len = buff.len() + uarum::SEQ_LEN + uarum::PAYLOAD_SIZE_LEN;

        let mut len_vec = uarum::to_vec(len as u32);
        len_vec.resize(uarum::PAYLOAD_SIZE_LEN, 0);

        let mut seq = uarum::to_vec(frame.seq as u32);
        seq.resize(uarum::SEQ_LEN, 0);

        let mut payload = Vec::with_capacity(len);

        payload.extend_from_slice(&len_vec);
        payload.extend_from_slice(&seq);
        payload.extend_from_slice(&buff);

        self.stream.write(&payload).await?;

        Ok(())
    }
}

#[derive(Debug)]
pub struct Frame {
    data: Data,
    seq: u16,
}

impl Frame {
    pub fn new(seq: u16, data: Data) -> Self {
        Self { data, seq }
    }

    fn parse(src: &mut Cursor<&[u8]>) -> Result<Frame, Error> {
        let mut len_buffer = vec![0; 4];
        src.copy_to_slice(&mut len_buffer);
        let len = uarum::from_vec(&len_buffer);

        let data: Data = ciborium::de::from_reader(&src.get_ref()[6..len])?;

        Ok(Frame {
            data,
            seq: uarum::from_vec(&src.get_ref()[4..6]) as u16,
        })
    }

    fn check(src: &mut Cursor<&[u8]>) -> bool {
        if src.remaining() < 4 {
            return false;
        }

        let mut len_buffer = vec![0; 4];
        src.copy_to_slice(&mut len_buffer);
        let len = uarum::from_vec(&len_buffer);

        if src.remaining() + 4 < len {
            return false;
        }

        src.set_position(len as u64);

        true
    }
}

mod uarum {
    pub const PAYLOAD_SIZE_LEN: usize = 4;
    pub const SEQ_LEN: usize = 2;

    pub const MAX_PAYLOAD_SIZE: u32 = u32::MAX;
    pub const MAX_OP_CODE: u16 = u16::MAX;

    pub fn to_vec(mut x: u32) -> Vec<u8> {
        let mut bin = Vec::new();

        while x != 0 {
            let rem = x % 256;
            x = x / 256;

            if x == 0 && rem == 0 {
                break;
            }

            bin.push(rem as u8);
        }

        return bin;
    }

    pub fn from_vec(data: &[u8]) -> usize {
        let mut parsed = 0_usize;

        let len = data.len();

        for i in 0..len {
            parsed += (data[i] as usize) * 256_usize.pow(i as u32);
        }

        return parsed;
    }
}

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Cbor deserialize Error: {0}")]
    CborDe(#[from] ciborium::ser::Error<std::io::Error>),
    #[error("Cbor serialize Error: {0}")]
    CborSer(#[from] ciborium::de::Error<std::io::Error>),
    #[error("connection reset by peer.")]
    ConnectionReset,
    #[error("Tokio io Error: {0}")]
    Io(#[from] tokio::io::Error),
    #[error("Was not able to authorize an incoming connection from: {0}")]
    Unauthorized(String),
    #[error("The connection from {0} was closed unexpectedly.")]
    UnexpectedClose(String),
}
