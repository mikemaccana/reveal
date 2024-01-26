import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorWtf } from "../target/types/anchor_wtf";
const log = console.log;

describe("anchor-wtf", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorWtf as Program<AnchorWtf>;
  const instructionHandlers = program.methods;

  test("reveal works", async () => {
    // Add your test here.
    const transactionSignature = await instructionHandlers.reveal().rpc();
    log("Your transaction signature:", transactionSignature);
    assert(transactionSignature);
  });
});
