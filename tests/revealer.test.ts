import { before, describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  LAMPORTS_PER_SOL as SOL,
  Transaction,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Keypair,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { Revealer } from "../target/types/revealer";
// TODO: using a slightly newer version of helpers
// While waiting for PRs  for some of these to be reviewed
import {
  confirmTransaction,
  makeKeypairs,
  requestAndConfirmAirdrop,
} from "./helpers";
import {
  DATA_SIZE,
  arrayOfNumbersToObject,
  objectToArrayOfNumbers,
} from "./encoder";
import { getPDAAndBump } from "./get-pda.ts";
const log = console.log;
const stringify = (object) => JSON.stringify(object, null, 2);

// https://solana.stackexchange.com/questions/3072/typeerror-anchor-bn-is-not-a-constructor-from-script
// @ts-ignore - the 'default' property is actually there, the type checker is wrong
const { BN } = anchor.default;

describe("encoding JS objects to byte arrays", () => {
  test("string to byte array", () => {
    const input = "hello world";
    const arrayOfNumbers = objectToArrayOfNumbers(input);
    assert(arrayOfNumbers.length === DATA_SIZE);
    const result = arrayOfNumbersToObject(arrayOfNumbers);
    assert.deepStrictEqual(result, input);
  });

  test("object to byte array", () => {
    const input = { greeting: "hello world" };
    const arrayOfNumbers = objectToArrayOfNumbers(input);
    assert(arrayOfNumbers.length === DATA_SIZE);
    const result = arrayOfNumbersToObject(arrayOfNumbers);
    assert.deepStrictEqual(result, input);
  });

  test.only("overly large object to byte array thrown an error", () => {
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

describe("getPDA", async () => {
  test("getPDAAndBump works", async () => {
    const id: typeof BN = new BN(randomBytes(8));
    const [userKeypair, programKeypair] = makeKeypairs(2);

    const pdaAndBump = PublicKey.findProgramAddressSync(
      [
        Buffer.from("somestring"),
        userKeypair.publicKey.toBuffer(),
        id.toBuffer("le", 8),
      ],
      programKeypair.publicKey
    );

    const pdaAndBump2 = getPDAAndBump(
      ["somestring", userKeypair.publicKey, id],
      programKeypair.publicKey
    );

    assert.deepEqual(pdaAndBump, pdaAndBump2);
  });
});

describe("revealer", async () => {
  // Configure the client to use the local cluster.
  const [sender, recipient] = makeKeypairs(2);

  const connection = new Connection("http://localhost:8899");

  await requestAndConfirmAirdrop(connection, sender.publicKey, 1 * SOL);

  const program = anchor.workspace.Revealer as anchor.Program<Revealer>;

  test("reveal instructions writes data that can be retrieved", async () => {
    const id: typeof BN = new BN(randomBytes(8));

    // Very basic implementation of Part 1
    // of https://www.irs.gov/pub/irs-pdf/f8300.pdf
    // TODO: not encrypting on-chain data yet, see README
    const data = {
      firstName: "Jane",
      middleInitial: "Q",
      lastName: "Smith",
      taxPayerId: "123456789",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "NY",
      zip: "12345",
      dob: "20000101",
      occupation: "student",
      identifyingDocument: "passport",
      identifyingDocumentNumber: "123456789",
      identifyingDocumentIssuingCountry: "USA",
    };

    const dataToPutOnChain = objectToArrayOfNumbers(data);

    let transaction = new Transaction();

    // Add a large compute unit limit
    // Fixes 'exceeded CUs meter at BPF instruction'
    const setComputeUnitLimitInstruction =
      ComputeBudgetProgram.setComputeUnitLimit({ units: 250_000 });
    transaction.add(setComputeUnitLimitInstruction);

    // We need to include ALL accounts
    // even if we haven't made them yet,
    // since the blockchain needs to check if they overlap with other transactions etc.
    // Needs to match instructions/reveal.ts
    const revelationAddress = getPDAAndBump(
      ["revelation", sender.publicKey, id],
      program.programId
    )[0];

    // Add the instruction from my Anchor program
    const revealInstruction = await program.methods
      .reveal(id, dataToPutOnChain)
      .accounts({
        sender: sender.publicKey,
        revelation: revelationAddress,
      })
      .instruction();
    transaction.add(revealInstruction);

    // TODO: use versioned transactions
    const transactionSignature = await connection.sendTransaction(
      transaction,
      [sender],
      {
        skipPreflight: true,
      }
    );

    assert(transactionSignature);

    await confirmTransaction(connection, transactionSignature);

    // Now get the data back
    const revelationAccount = await connection.getAccountInfo(
      revelationAddress
    );

    const dataFromChain = revelationAccount?.data;
    if (!dataFromChain) {
      throw new Error(`No account data at ${revelationAddress}`);
    }

    const account = await program.account.revelation.fetch(revelationAddress);

    const dataObjectFromChain = arrayOfNumbersToObject(account.data);

    // And make sure it matches!
    assert.deepEqual(dataObjectFromChain, data);
  });
});
