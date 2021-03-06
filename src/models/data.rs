use std::fmt;

use serde::{
    de::{Error as DeError, IgnoredAny, MapAccess, Unexpected, Visitor},
    ser::SerializeStruct,
    Deserialize, Deserializer, Serialize, Serializer,
};

use super::{
    discord::{Channel, Guild, GuildResource, Member, Message, Role, User},
    Identify, Stats,
};

#[derive(Debug)]
pub enum Data {
    Identify(Identify),
    Hello,
    Nani(ciborium::value::Value),
    GetStats,
    Stats(Stats),
    CacheGuild(Guild),
    CacheChannel(Channel),
    CacheRole(GuildResource<Role>),
    CacheMember(GuildResource<Member>),
    CacheUser(User),
    CacheMessage(Message),
}

impl Data {
    fn get_op(&self) -> OpCode {
        match self {
            Self::Identify(_) => OpCode::Identify,
            Self::Hello => OpCode::Hello,
            Self::Nani(_) => OpCode::Nani,
            Self::GetStats => OpCode::GetStats,
            Self::Stats(_) => OpCode::Stats,
            Self::CacheGuild(_) => OpCode::CacheGuild,
            Self::CacheChannel(_) => OpCode::CacheChannel,
            Self::CacheRole(_) => OpCode::CacheRole,
            Self::CacheMember(_) => OpCode::CacheMember,
            Self::CacheUser(_) => OpCode::CacheUser,
            Self::CacheMessage(_) => OpCode::CacheMessage,
        }
    }
}

#[derive(Debug)]
pub enum OpCode {
    Identify,
    Hello,
    Nani,
    GetStats,
    Stats,
    CacheGuild,
    CacheChannel,
    CacheRole,
    CacheMember,
    CacheUser,
    CacheMessage,
}

impl TryFrom<u8> for OpCode {
    type Error = String;

    fn try_from(op: u8) -> Result<Self, Self::Error> {
        match op {
            0 => Ok(OpCode::Identify),
            1 => Ok(OpCode::Hello),
            2 => Ok(OpCode::Nani),
            3 => Ok(OpCode::GetStats),
            4 => Ok(OpCode::Stats),
            5 => Ok(OpCode::CacheGuild),
            6 => Ok(OpCode::CacheChannel),
            7 => Ok(OpCode::CacheRole),
            8 => Ok(OpCode::CacheMember),
            9 => Ok(OpCode::CacheUser),
            10 => Ok(OpCode::CacheMessage),
            _ => Err(format!("u8 {} cannot converted to an OpCode", op)),
        }
    }
}

impl From<OpCode> for u8 {
    fn from(op: OpCode) -> Self {
        match op {
            OpCode::Identify => 0,
            OpCode::Hello => 1,
            OpCode::Nani => 2,
            OpCode::GetStats => 3,
            OpCode::Stats => 4,
            OpCode::CacheGuild => 5,
            OpCode::CacheChannel => 6,
            OpCode::CacheRole => 7,
            OpCode::CacheMember => 8,
            OpCode::CacheUser => 9,
            OpCode::CacheMessage => 10,
        }
    }
}

impl<'de> Deserialize<'de> for Data {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        deserializer.deserialize_any(DataVisitor)
    }
}

#[derive(Debug, Deserialize)]
#[serde(field_identifier, rename_all = "snake_case")]
enum Field {
    #[serde(rename = "d")]
    Data,
    Op,
}

struct DataVisitor;

impl<'de> Visitor<'de> for DataVisitor {
    type Value = Data;

    fn expecting(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("data struct")
    }

    fn visit_map<V: MapAccess<'de>>(self, mut map: V) -> Result<Self::Value, V::Error> {
        let mut op: Option<OpCode> = None;

        loop {
            let key = match map.next_key() {
                Ok(Some(key)) => key,
                Ok(None) => break,
                Err(_) => {
                    map.next_value::<IgnoredAny>()?;

                    continue;
                }
            };

            match key {
                Field::Op => {
                    if op.is_some() {
                        return Err(DeError::duplicate_field("op"));
                    }

                    let raw: u8 = map.next_value()?;
                    op = Some(OpCode::try_from(raw).map_err(|_| {
                        DeError::invalid_value(
                            Unexpected::Unsigned(raw.into()),
                            &"valid u8 for OpCode",
                        )
                    })?);
                }
                Field::Data => {
                    if op.is_none() {
                        return Err(DeError::missing_field("op"));
                    }

                    break;
                }
            };
        }

        let op = op.ok_or_else(|| DeError::missing_field("op"))?;

        Ok(match op {
            OpCode::Identify => {
                let identify = map.next_value()?;

                Data::Identify(identify)
            }
            OpCode::Hello => Data::Hello,
            OpCode::Nani => {
                let nani = map.next_value()?;

                Data::Nani(nani)
            }
            OpCode::GetStats => Data::GetStats,
            OpCode::Stats => {
                let stats = map.next_value()?;

                Data::Stats(stats)
            }
            OpCode::CacheGuild => {
                let guild = map.next_value()?;

                Data::CacheGuild(guild)
            }
            OpCode::CacheChannel => {
                let channel = map.next_value()?;

                Data::CacheChannel(channel)
            }
            OpCode::CacheRole => {
                let role = map.next_value()?;

                Data::CacheRole(role)
            }
            OpCode::CacheMember => {
                let member = map.next_value()?;

                Data::CacheMember(member)
            }
            OpCode::CacheUser => {
                let user = map.next_value()?;

                Data::CacheUser(user)
            }
            OpCode::CacheMessage => {
                let message = map.next_value()?;

                Data::CacheMessage(message)
            }
        })
    }
}

impl Serialize for Data {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        let mut state = serializer.serialize_struct("Data", 2)?;

        state.serialize_field("op", &u8::from(self.get_op()))?;

        match &self {
            Data::Identify(i) => state.serialize_field("d", i)?,
            Data::Hello => state.serialize_field("d", &())?,
            Data::Nani(n) => state.serialize_field("d", n)?,
            Data::GetStats => state.serialize_field("d", &())?,
            Data::Stats(s) => state.serialize_field("d", s)?,
            Data::CacheGuild(g) => state.serialize_field("d", g)?,
            Data::CacheChannel(c) => state.serialize_field("d", c)?,
            Data::CacheRole(r) => state.serialize_field("d", r)?,
            Data::CacheMember(m) => state.serialize_field("d", m)?,
            Data::CacheUser(u) => state.serialize_field("d", u)?,
            Data::CacheMessage(m) => state.serialize_field("d", m)?,
        }

        state.end()
    }
}
