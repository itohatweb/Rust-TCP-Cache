use serde::{Deserialize, Serialize};

use super::is_false;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub activity: Option<Box<MessageActivity>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub application: Option<Box<MessageApplication>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub application_id: Option<u64>,
    pub attachments: Vec<Box<Attachment>>,
    // pub author: User,
    pub author: u64,
    pub channel_id: u64,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub components: Vec<Box<Component>>,
    pub content: String,
    pub edited_timestamp: Option<Box<String>>,
    pub embeds: Vec<Box<Embed>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub flags: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub guild_id: Option<u64>,
    pub id: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub interaction: Option<Box<MessageInteraction>>,
    #[serde(rename = "type")]
    pub kind: u8,
    // #[serde(skip_serializing_if = "Option::is_none")]
    // pub member: Option<Member>,
    // #[serde(default, skip_serializing_if = "Vec::is_empty")]
    // pub mention_channels: Vec<Box<ChannelMention>>,
    // pub mention_everyone: bool,
    // pub mention_roles: Vec<u64>,
    // pub mentions: Vec<Box<Mention>>,
    pub pinned: bool,
    // #[serde(default, skip_serializing_if = "Vec::is_empty")]
    // pub reactions: Vec<Box<MessageReaction>>,
    // #[serde(rename = "message_reference", skip_serializing_if = "Option::is_none")]
    // pub reference: Option<Box<MessageReference>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub referenced_message: Option<Box<Message>>,
    // #[serde(default)]
    // pub sticker_items: Vec<Box<MessageSticker>>,
    pub thread_id: Option<u64>,
    // pub timestamp: String,
    // #[serde(skip_serializing_if = "Option::is_none")]
    // pub thread: Option<Channel>,
    // pub tts: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub webhook_id: Option<u64>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageActivity {
    #[serde(rename = "type")]
    pub kind: u8,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub party_id: Option<Box<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageApplication {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cover_image: Option<Box<String>>,
    pub description: String,
    pub icon: Option<Box<String>>,
    pub id: u64,
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Attachment {
    pub content_type: Option<Box<String>>,
    #[serde(default, skip_serializing_if = "is_false")]
    pub ephemeral: bool,
    pub filename: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u64>,
    pub id: u64,
    pub proxy_url: String,
    pub size: u64,
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u64>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Component {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub components: Option<Vec<Component>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub custom_id: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub disabled: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub emoji: Option<Reaction>,
    #[serde(rename = "type")]
    pub kind: u8,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_length: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_values: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_length: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_values: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub options: Option<Vec<SelectMenuOption>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub placeholder: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub style: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<Box<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Reaction {
    #[serde(skip_serializing_if = "Option::is_none")]
    animated: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    name: Option<Box<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SelectMenuOption {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub emoji: Option<Box<Reaction>>,
    pub label: String,
    pub value: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Embed {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<Box<EmbedAuthor>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fields: Option<Vec<EmbedField>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub footer: Option<Box<EmbedFooter>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image: Option<Box<EmbedImage>>,
    #[serde(rename = "type")]
    pub kind: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider: Option<Box<EmbedProvider>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<Box<EmbedThumbnail>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub video: Option<Box<EmbedVideo>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedAuthor {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<Box<String>>,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proxy_icon_url: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<Box<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedField {
    #[serde(default)]
    pub inline: bool,
    pub name: String,
    pub value: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedFooter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proxy_icon_url: Option<Box<String>>,
    pub text: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedImage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proxy_url: Option<Box<String>>,
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u64>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedProvider {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<Box<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedThumbnail {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proxy_url: Option<Box<String>>,
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u64>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbedVideo {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proxy_url: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<Box<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u64>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageInteraction {
    pub id: u64,
    #[serde(rename = "type")]
    pub kind: u8,
    pub name: String,
    pub user: u64,
}
