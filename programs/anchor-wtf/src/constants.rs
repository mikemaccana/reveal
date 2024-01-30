use anchor_lang::prelude::*;

#[constant]
pub const SEED: &str = "anchor";

#[constant]
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

// Must match MAX_DATA_SIZE in the TS client
#[constant]
pub const MAX_DATA_SIZE: usize = 992;
