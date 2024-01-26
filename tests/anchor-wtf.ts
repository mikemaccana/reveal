import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorWtf } from "../target/types/anchor_wtf";

describe("anchor-wtf", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorWtf as Program<AnchorWtf>;

  it("Is reveald!", async () => {
    // Add your test here.
    const tx = await program.methods.reveal().rpc();
    console.log("Your transaction signature", tx);
  });
});
