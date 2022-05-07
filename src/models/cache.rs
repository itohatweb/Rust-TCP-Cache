use dashmap::{DashMap, DashSet};

use super::discord::{Channel, Guild, Member, Role, User};

pub struct Cache {
    pub channels: DashMap<u64, Channel>,
    pub guilds: DashMap<u64, Guild>,
    pub guild_channels: DashMap<u64, DashSet<u64>>,
    pub guild_members: DashMap<u64, DashSet<u64>>,
    pub guild_roles: DashMap<u64, DashSet<u64>>,
    /// Key is: (Guild Id, User Id)
    pub members: DashMap<(u64, u64), Member>,
    pub roles: DashMap<u64, Role>,
    pub users: DashMap<u64, User>,
}

impl Cache {
    pub fn new() -> Self {
        Self {
            channels: DashMap::new(),
            guilds: DashMap::new(),
            guild_channels: DashMap::new(),
            guild_members: DashMap::new(),
            guild_roles: DashMap::new(),
            members: DashMap::new(),
            roles: DashMap::new(),
            users: DashMap::new(),
        }
    }
}
//     users: DashMap<Id<UserMarker>, User>,
//     user_guilds: DashMap<Id<UserMarker>, BTreeSet<Id<GuildMarker>>>,

// pub struct InMemoryCache {
//     config: Config,
//     channel_messages: DashMap<Id<ChannelMarker>, VecDeque<Id<MessageMarker>>>,
//     // So long as the lock isn't held across await or panic points this is fine.
//     current_user: Mutex<Option<CurrentUser>>,
//     emojis: DashMap<Id<EmojiMarker>, GuildResource<CachedEmoji>>,
//     guild_emojis: DashMap<Id<GuildMarker>, HashSet<Id<EmojiMarker>>>,
//     guild_integrations: DashMap<Id<GuildMarker>, HashSet<Id<IntegrationMarker>>>,
//     guild_presences: DashMap<Id<GuildMarker>, HashSet<Id<UserMarker>>>,
//     guild_stage_instances: DashMap<Id<GuildMarker>, HashSet<Id<StageMarker>>>,
//     guild_stickers: DashMap<Id<GuildMarker>, HashSet<Id<StickerMarker>>>,
//     integrations:
//         DashMap<(Id<GuildMarker>, Id<IntegrationMarker>), GuildResource<GuildIntegration>>,
//     messages: DashMap<Id<MessageMarker>, CachedMessage>,
//     presences: DashMap<(Id<GuildMarker>, Id<UserMarker>), CachedPresence>,
//     stage_instances: DashMap<Id<StageMarker>, GuildResource<StageInstance>>,
//     stickers: DashMap<Id<StickerMarker>, GuildResource<CachedSticker>>,
//     unavailable_guilds: DashSet<Id<GuildMarker>>,
//     voice_state_channels: DashMap<Id<ChannelMarker>, HashSet<(Id<GuildMarker>, Id<UserMarker>)>>,
//     voice_state_guilds: DashMap<Id<GuildMarker>, HashSet<Id<UserMarker>>>,
//     voice_states: DashMap<(Id<GuildMarker>, Id<UserMarker>), CachedVoiceState>,
// }
