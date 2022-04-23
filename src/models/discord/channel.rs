use serde::{Deserialize, Serialize};

use super::Permissions;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub application_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bitrate: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_auto_archive_duration: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub guild_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub icon: Option<Box<String>>,
    pub id: u64,
    #[serde(rename = "type")]
    pub kind: u8,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_message_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_pin_timestamp: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub member: Option<Box<ThreadMember>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub member_count: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_count: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub newly_created: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nsfw: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub permission_overwrites: Option<Vec<PermissionOverwrite>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rate_limit_per_user: Option<u64>,
    // TODO
    // #[serde(skip_serializing_if = "Option::is_none")]
    // pub recipients: Option<Vec<User>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rtc_region: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thread_metadata: Option<Box<ThreadMetadata>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub topic: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_limit: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub video_quality_mode: Option<u8>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ThreadMember {
    pub flags: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<u64>,
    pub join_timestamp: String,
    // TODO
    // #[serde(skip_serializing_if = "Option::is_none")]
    // pub member: Option<Member>,
    // #[serde(skip_serializing_if = "Option::is_none")]
    // pub presence: Option<Presence>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<u64>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ThreadMetadata {
    pub archived: bool,
    pub auto_archive_duration: u16,
    pub archive_timestamp: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub create_timestamp: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invitable: Option<bool>,
    #[serde(default)]
    pub locked: bool,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PermissionOverwrite {
    pub allow: Permissions,
    pub deny: Permissions,
    pub id: u64,
    #[serde(rename = "type")]
    pub kind: u8,
}
