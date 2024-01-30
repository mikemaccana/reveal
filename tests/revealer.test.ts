import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  LAMPORTS_PER_SOL as SOL,
  Transaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { Revealer } from "../target/types/revealer";
import {
  makeKeypairs,
  requestAndConfirmAirdrop,
} from "@solana-developers/helpers";
import {
  DATA_SIZE,
  arrayOfNumbersToObject,
  objectToArrayOfNumbers,
} from "./encoder";
const log = console.log;

describe("encoding JS objects to arrays of numbers", () => {
  test("string to array of numbers", () => {
    const input = "hello world";
    const arrayOfNumbers = objectToArrayOfNumbers(input);
    assert(arrayOfNumbers.length === DATA_SIZE);
    const result = arrayOfNumbersToObject(arrayOfNumbers);
    assert.deepStrictEqual(result, input);
  });

  test("object to array of numbers", () => {
    const input = { greeting: "hello world" };
    const arrayOfNumbers = objectToArrayOfNumbers(input);
    assert(arrayOfNumbers.length === DATA_SIZE);
    const result = arrayOfNumbersToObject(arrayOfNumbers);
    assert.deepStrictEqual(result, input);
  });

  test.only("overly large object to array of numbers thrown an error", () => {
    let didThrow = false;
    const largeString =
      `"Skateboarding is the ultimate expression of freedom and creativity. It's a way of life that's all about pushing boundaries, breaking rules, and living on the edge. With every trick, every grind, every flip, we're defying gravity and redefining what's possible. Skateboarding is more than just a sport, it's a culture, a community, and a way of seeing the world. It's about taking risks, challenging yourself, and never giving up. So grab your board, hit the streets, and let's show the world what we're made of! #skatelife #90s #radical #cool #skateboardingislife`.repeat(
        30
      );
    try {
      objectToArrayOfNumbers(largeString);
    } catch (thrownObject) {
      const error = thrownObject as Error;
      assert(error.message.includes("data too large"));
      didThrow = true;
    }
    assert(didThrow);
  });
});

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
  // @ts-ignore - the 'default' property is actually there, the type checker is wrong
  const { BN } = anchor.default;

  const program = anchor.workspace.Revealer as anchor.Program<Revealer>;

  test("reveal works", async () => {
    // TODO: make random
    const id: typeof BN = new BN(1);

    const data = { greeting: "hello world" };

    const encodedData = objectToArrayOfNumbers(data);

    log(`ID is:`, id.toString());

    let tx = new Transaction();

    // Add a compute unit limit
    const setComputeUnitLimitInstruction =
      ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 });
    tx.add(setComputeUnitLimitInstruction);

    // Add the instruction from my Anchor program
    const revealInstruction = await program.methods
      .reveal(id, encodedData)
      .instruction();
    tx.add(revealInstruction);

    const transactionSignature = await connection.sendTransaction(
      tx,
      [sender],
      {
        skipPreflight: true,
      }
    );

    log("Your transaction signature:", transactionSignature);
    assert(transactionSignature);
  });
});
