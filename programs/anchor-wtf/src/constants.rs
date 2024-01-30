use anchor_lang::prelude::*;

#[constant]
pub const SEED: &str = "anchor";

#[constant]
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

// Must match DATA_SIZE in the TS client
#[constant]
pub const DATA_SIZE: usize = 992;
