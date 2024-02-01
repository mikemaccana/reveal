import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const log = console.log;

// https://solana.stackexchange.com/questions/3072/typeerror-anchor-bn-is-not-a-constructor-from-script
// @ts-ignore - the 'default' property is actually there, the type checker is wrong
const { BN } = anchor.default;

// A generic function to take strings, publickeys, and BNs
// does whatever work is necessary to turn them into PDAs
export const getPDAAndBump = (
  // @ts-ignore this type exists
  inputs: Array<string | PublicKey | BN>,
  programId: PublicKey
) => {
  const buffers = inputs.map((input) => {
    if (typeof input === "string") {
      return Buffer.from(input);
    }
    // TODO: not sure why instanceof occasionally doesn't work
    // fix it and get riud of the constructor hack
    if (input instanceof PublicKey || input.constructor.name === "PublicKey") {
      return input.toBuffer();
    }
    // @ts-ignore this type exists
    if (input instanceof BN) {
      return input.toBuffer("le", 8);
    }
    throw new Error("getPDAAndBump: unsupported type");
  });
  const programAddressAndBump = PublicKey.findProgramAddressSync(
    buffers,
    programId
  );
  return programAddressAndBump;
};
