use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Stats {
    pub guilds: usize,
    pub used_memory: f64,
}
