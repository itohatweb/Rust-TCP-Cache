use dashmap::DashMap;

use super::discord::Guild;

pub struct Cache {
    pub guilds: DashMap<u64, Guild>,
}

impl Cache {
    pub fn new() -> Self {
        Self {
            guilds: DashMap::new(),
        }
    }
}
