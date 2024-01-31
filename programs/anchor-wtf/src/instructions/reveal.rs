use anchor_lang::prelude::*;

use crate::{Revelation, DATA_SIZE};

#[derive(Accounts)]
#[instruction(id: u64)]
// pub struct RevealAccounts<'info> {
pub struct RevealAccounts {
    // #[account(mut)]
    // pub sender: Signer<'info>,

    // #[account(
    //     init,
    //     payer = sender,
    //     space = 1000,
    //     seeds=[b"revelation", sender.key().as_ref(), id.to_le_bytes().as_ref()],
    //     bump
    // )]
    // pub revelation: Account<'info, Revelation>,

    // pub system_program: Program<'info, System>,
}

pub fn handler(_context: Context<RevealAccounts>, id: u64, data: [u8; DATA_SIZE]) -> Result<()> {
    msg!("ID is: {}", id);
    msg!("Data is: {:?}", data);

    // _context
    //     .accounts
    //     .revelation
    //     .set_inner(Revelation { id, data });
    Ok(())
}
