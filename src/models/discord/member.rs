use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Member {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub communication_disabled_until: Option<String>,
    pub deaf: Option<bool>,
    pub joined_at: String,
    pub mute: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nick: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pending: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub premium_since: Option<Box<String>>,
    pub roles: Vec<u64>,
    pub user_id: u64,
}
