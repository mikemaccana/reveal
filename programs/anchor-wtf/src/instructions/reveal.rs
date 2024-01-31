use anchor_lang::prelude::*;

use crate::{Revelation, ANCHOR_DISCRIMINATOR_SIZE, DATA_SIZE};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct RevealAccounts<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init,
        payer = sender,
        space = ANCHOR_DISCRIMINATOR_SIZE + Revelation::INIT_SPACE,
        seeds=[b"revelation", sender.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub revelation: Account<'info, Revelation>,

    pub system_program: Program<'info, System>,
}

pub fn handler(context: Context<RevealAccounts>, id: u64, data: [u8; DATA_SIZE]) -> Result<()> {
    msg!("ID is: {}", id);
    msg!("Data is: {:?}", data);

    context.accounts.revelation.set_inner(Revelation {
        id,
        data,
        bump: context.bumps.revelation,
    });
    Ok(())
}
