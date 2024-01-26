import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Revealer } from "../target/types/revealer";
import { makeKeypairs } from "@solana-developers/helpers";
const log = console.log;

describe("revealer", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Revealer as Program<Revealer>;
  const instructionHandlers = program.methods;

  test("reveal works", async () => {
    const [sender, recipient] = makeKeypairs(2);

    const transactionSignature = await instructionHandlers.reveal().rpc();
    log("Your transaction signature:", transactionSignature);
    assert(transactionSignature);
  });
});
