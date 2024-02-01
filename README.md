# Reveal

- Sender wants to send someone 10,000
- Recipient wants to be able to collect Form 8300 data

how does wallet adapter relate to wallet connect?

4 bytes (to store size) plus length of the string

https://www.anchor-lang.com/docs/space

anchor init projectname --template=multiple

https://whimsical.com/8300-reveal-architecture-diagram-GfD5WCPooLam6WZzb1YFAf

- Sender app (likely a wallet) encrypts senders private data with recipient oubkey
- Sender makes transaction:
  - TokenProgram.transfer() for the 10K+ transaction
  - RevealProgram.reveal() for the relevent 8300 details  
    This instruction includes the pubkey of the sender, the pubkey of the recipient, and the senders identity information encrypted with the pubkey of the recipient.

Step 4: Anyone on Solana can look up the data in the PDA, however only the recipient can decrypt the data inside. This ensures the sender can prove their identity to the recipient but not publicly.

## Tests

```
anchor test
```
