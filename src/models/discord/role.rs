use serde::{Deserialize, Serialize};

use super::Permissions;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Role {
    pub color: u32,
    pub hoist: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub icon: Option<Box<String>>,
    pub id: u64,
    pub managed: bool,
    pub mentionable: bool,
    pub name: String,
    pub permissions: Permissions,
    pub position: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Box<RoleTags>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unicode_emoji: Option<Box<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleTags {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bot_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub integration_id: Option<u64>,
    #[serde(default, skip_serializing_if = "is_false", with = "true_null")]
    pub premium_subscriber: bool,
}

fn is_false(value: &bool) -> bool {
    value == &false
}

// Discord is cursed, `null` means `true` WHHAAAAAT
mod true_null {
    use serde::{
        de::{Deserializer, Error as DeError, Visitor},
        ser::Serializer,
    };
    use std::fmt;

    struct TrueNullVisitor;

    impl<'de> Visitor<'de> for TrueNullVisitor {
        type Value = bool;

        fn expecting(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            f.write_str("null")
        }

        fn visit_none<E: DeError>(self) -> Result<Self::Value, E> {
            Ok(true)
        }
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(deserializer: D) -> Result<bool, D::Error> {
        deserializer.deserialize_option(TrueNullVisitor)
    }

    pub fn serialize<S: Serializer>(_: &bool, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_none()
    }
}
