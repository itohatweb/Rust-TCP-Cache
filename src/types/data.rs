use serde::{Deserialize, Serialize};

use super::Identify;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "t", content = "d")]
pub enum Data {
    Identify(Identify),
    Hello,
}
