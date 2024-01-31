use anchor_lang::prelude::*;

use crate::DATA_SIZE;

#[account]
#[derive(InitSpace)]
pub struct Revelation {
    pub id: u64,
    pub data: [u8; DATA_SIZE],
}
