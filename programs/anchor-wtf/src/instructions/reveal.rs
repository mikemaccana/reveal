use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RevealAccountConstraints {}

pub fn handler(_context: Context<RevealAccountConstraints>, id: u64) -> Result<()> {
    msg!("ID is: {}", id);
    Ok(())
}
