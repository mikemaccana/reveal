import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import * as anchor from "@coral-xyz/anchor";

import { Revealer } from "../target/types/revealer";
import {
  makeKeypairs,
  requestAndConfirmAirdrop,
} from "@solana-developers/helpers";
const log = console.log;

const stringToArrayOfNumbers = (string: string) => {
  return Array.from(new Uint8Array(Buffer.from(string, "utf-8")));
};

describe("revealer", async () => {
  // Configure the client to use the local cluster.
  const [sender, recipient] = makeKeypairs(2);

  const connection = new anchor.web3.Connection("http://localhost:8899");

  await requestAndConfirmAirdrop(connection, sender.publicKey, 1_000_000_000);

  // Connect to Anchor as sender
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(sender),
    anchor.AnchorProvider.defaultOptions()
  );

  // Set the provider
  anchor.setProvider(provider);

  // https://solana.stackexchange.com/questions/3072/typeerror-anchor-bn-is-not-a-constructor-from-script
  // @ts-ignore
  const { BN } = anchor.default;

  const program = anchor.workspace.Revealer as anchor.Program<Revealer>;
  const instructionHandlers = program.methods;

  test("reveal works", async () => {
    const id: typeof BN = new BN(1);
    // convert baddata to an array of numbers
    const data = Array(950).fill(1);

    log(`ID is:`, id.toString());
    const transactionSignature = await instructionHandlers
      .reveal(id, data)
      .rpc();
    log("Your transaction signature:", transactionSignature);
    assert(transactionSignature);
  });
});
