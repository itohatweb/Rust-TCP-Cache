use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    pub channels: usize,
    pub guilds: usize,
    pub members: usize,
    pub messages: usize,
    pub roles: usize,
    pub used_memory: f64,
    pub users: usize,
}
