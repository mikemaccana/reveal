import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { LAMPORTS_PER_SOL as SOL } from "@solana/web3.js";
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

  await requestAndConfirmAirdrop(connection, sender.publicKey, 1 * SOL);

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

  // Must match MAX_DATA_SIZE in the on chain program
  // Anything more than this will fail with ERR_OUT_OF_RANGE
  const MAX_DATA_SIZE = 992;

  test("reveal works", async () => {
    const id: typeof BN = new BN(1);
    // convert baddata to an array of numbers

    const data = Array(MAX_DATA_SIZE).fill(1);
    // const data = stringToArrayOfNumbers("hello world"))

    assert(data.length <= MAX_DATA_SIZE, `Data is too large`);

    log(`ID is:`, id.toString());
    const transactionSignature = await instructionHandlers
      .reveal(id, data)
      .rpc();
    log("Your transaction signature:", transactionSignature);
    assert(transactionSignature);
  });
});
