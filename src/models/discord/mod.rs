mod channel;
mod guild;
mod member;
mod message;
mod permissions;
mod role;
mod user;

pub use channel::{Channel, PermissionOverwrite, ThreadMember, ThreadMetadata};
pub use guild::Guild;
pub use member::Member;
pub use message::Message;
pub use permissions::Permissions;
pub use role::{Role, RoleTags};
pub use user::User;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GuildResource<T> {
    pub guild_id: u64,
    pub value: T,
}

fn is_false(value: &bool) -> bool {
    value == &false
}
