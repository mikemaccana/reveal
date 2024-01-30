use anchor_lang::prelude::*;

use crate::DATA_SIZE;

#[derive(Accounts)]
pub struct RevealAccountConstraints {}

pub fn handler(
    _context: Context<RevealAccountConstraints>,
    id: u64,
    data: [u8; DATA_SIZE],
) -> Result<()> {
    msg!("ID is: {}", id);
    msg!("Data is: {:?}", data);
    Ok(())
}
