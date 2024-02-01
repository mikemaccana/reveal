# Reveal

- Sender wants to send someone 10,000
- Recipient wants to be able to collect [Form 8300](https://www.irs.gov/pub/irs-pdf/f8300.pdf) data

https://whimsical.com/8300-reveal-architecture-diagram-GfD5WCPooLam6WZzb1YFAf

- Sender app (likely a wallet) encrypts senders private data with recipient pubkey
- Sender makes transaction with the following instructions:
  - ComputeBudgetProgram.setComputeUnitLimit() to increase the budget (needed for ins)
  - TokenProgram.transfer() for the 10K+ transaction
  - RevealProgram.reveal() for the relevent 8300 details  
    This instruction includes the pubkey of the sender, the pubkey of the recipient, and the senders identity information encrypted with the pubkey of the recipient.

Step 4: Anyone on Solana can look up the data in the PDA, however only the recipient can decrypt the data inside. This ensures the sender can prove their identity to the recipient but not publicly.

## Tests

Just run:

```
anchor test
```

## Limits

While the on-chain portion works, the client-side encryption still needs some tweaking.
TweetNaCL isn't very well maintained, so I decided to use webcrypto, and did convert web3 js keys to webcrypto,
but still have yet to implement webcrypto Ed25519 encryption.
