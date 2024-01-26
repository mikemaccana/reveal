import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import * as anchor from "@coral-xyz/anchor";

import { Revealer } from "../target/types/revealer";
import { makeKeypairs } from "@solana-developers/helpers";
const log = console.log;

describe("revealer", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // https://solana.stackexchange.com/questions/3072/typeerror-anchor-bn-is-not-a-constructor-from-script
  // @ts-ignore
  const { BN } = anchor.default;

  const program = anchor.workspace.Revealer as anchor.Program<Revealer>;
  const instructionHandlers = program.methods;

  test("reveal works", async () => {
    const [sender, recipient] = makeKeypairs(2);
    const id = new BN(1);
    log(`is is`, id.toString());
    const transactionSignature = await instructionHandlers.reveal(id).rpc();
    log("Your transaction signature:", transactionSignature);
    assert(transactionSignature);
  });
});
