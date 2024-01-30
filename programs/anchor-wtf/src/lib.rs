pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Vo95BRgRsTyyrxWvy35GbGQxfMZxZrDXcuj93Dy4vdb");

#[program]
pub mod revealer {
    use super::*;

    pub fn reveal(
        context: Context<RevealAccountConstraints>,
        id: u64,
        data: [u8; DATA_SIZE],
    ) -> Result<()> {
        reveal::handler(context, id, data)
    }
}
