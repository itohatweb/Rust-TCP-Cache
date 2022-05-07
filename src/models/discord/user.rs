use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub accent_color: Option<u64>,
    pub avatar: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub banner: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bot: Option<bool>,
    pub discriminator: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub flags: Option<u64>,
    pub id: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub locale: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mfa_enabled: Option<bool>,
    pub username: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub premium_type: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub public_flags: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub verified: Option<bool>,
}
