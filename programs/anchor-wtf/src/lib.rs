pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("FhpcYtvyN8PZFZxjGJ1GuaDg7dLLajsP8jHoseQwZdeY");

#[program]
pub mod anchor_wtf {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}
