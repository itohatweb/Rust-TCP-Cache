use dashmap::{DashMap, DashSet};

use super::discord::{Channel, Guild, Role};

pub struct Cache {
    pub channels: DashMap<u64, Channel>,
    pub guilds: DashMap<u64, Guild>,
    pub guild_channels: DashMap<u64, DashSet<u64>>,
    pub guild_roles: DashMap<u64, DashSet<u64>>,
    pub roles: DashMap<u64, Role>,
}

impl Cache {
    pub fn new() -> Self {
        Self {
            channels: DashMap::new(),
            guilds: DashMap::new(),
            guild_channels: DashMap::new(),
            guild_roles: DashMap::new(),
            roles: DashMap::new(),
        }
    }
}
