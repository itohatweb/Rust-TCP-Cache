use serde::{Deserialize, Serialize};

use super::{discord::Guild, Identify, Stats};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "t", content = "d")]
pub enum Data {
    Identify(Identify),
    Hello,
    Nani(u64),
    GetStats,
    Stats(Stats),
    CacheGuild(Guild),
}
