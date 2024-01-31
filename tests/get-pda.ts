// TODO: make a generic function to take strings, publickeys, and BNs and turn them into buffers
// const programAddressAndBump = getProgramAddressAndBump(
//   ["revelation", sender.publicKey, id],
//   program.programId
// );

import { PublicKey } from "@solana/web3.js";

// const revelation = programAddressAndBump[0];
const getProgramAddressAndBump = (
  // @ts-ignore this type exists
  inputs: Array<string | PublicKey | BN>,
  programId: PublicKey
) => {
  const buffers = inputs.map((input) => {
    if (typeof input === "string") {
      return Buffer.from(input);
    }
    if (input instanceof PublicKey) {
      return input.toBuffer();
    }
    // @ts-ignore this type exists
    if (input instanceof BN) {
      return input.toBuffer();
    }
  });
  const programAddressAndBump = PublicKey.findProgramAddressSync(
    buffers,
    programId
  );
  return programAddressAndBump;
};
