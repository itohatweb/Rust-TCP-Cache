use serde::{Deserialize, Serialize};

#[derive(Debug, Eq, PartialEq, Serialize, Deserialize)]
pub struct Guild {
    pub afk_channel_id: Option<u64>,
    pub afk_timeout: u64,
    pub application_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub approximate_member_count: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub approximate_presence_count: Option<u64>,
    pub banner: Option<String>,
    pub default_message_notifications: u8,
    pub description: Option<String>,
    pub discovery_splash: Option<String>,
    pub explicit_content_filter: u8,
    pub features: Vec<String>,
    pub icon: Option<String>,
    pub id: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub joined_at: Option<String>,
    pub large: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_members: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_presences: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_video_channel_users: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub member_count: Option<u64>,
    pub mfa_level: u8,
    pub name: String,
    pub nsfw_level: u8,
    pub owner_id: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub owner: Option<bool>,
    // #[serde(skip_serializing_if = "Option::is_none")]
    // pub permissions: Option<Permissions>,
    pub preferred_locale: String,
    /// Whether the premium progress bar is enabled in the guild.
    pub premium_progress_bar_enabled: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub premium_subscription_count: Option<u64>,
    #[serde(default)]
    pub premium_tier: u8,
    pub rules_channel_id: Option<u64>,
    pub splash: Option<String>,
    pub system_channel_flags: u64,
    pub system_channel_id: Option<u64>,
    #[serde(default)]
    pub unavailable: bool,
    pub vanity_url_code: Option<String>,
    pub verification_level: u8,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub widget_channel_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub widget_enabled: Option<bool>,
}
