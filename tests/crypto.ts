import { fromLegacyKeypair } from "@solana/compat";
import { makeKeypairs } from "@solana-developers/helpers";
import { Keypair } from "@solana/web3.js";
const log = console.log;

const [sender, recipient] = makeKeypairs(2);

// Can you encrypt a string using the publickey of a ed25519 CryptoKeyPair?
// by copilot
async function encryptString(publicKey, stringToEncrypt) {
  const ephemeralKeypair = Keypair.generate();
  const ephemeralKeypairWC = await fromLegacyKeypair(ephemeralKeypair);
  const sharedSecret = await crypto.subtle.deriveBits(
    {
      name: "ECDH",
      namedCurve: "X25519",
      public: publicKey,
    },
    ephemeralKeypairWC.privateKey,
    256
  );
  const nonce = window.crypto.getRandomValues(new Uint8Array(24));
  const encodedString = new TextEncoder().encode(stringToEncrypt);
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
      tagLength: 128,
    },
    sharedSecret,
    encodedString
  );
  return {
    encryptedData,
    nonce,
    ephemeralPublicKey: ephemeralKeypair.publicKey,
  };
}

// Example usage
const senderWC = await fromLegacyKeypair(sender);
const recipientWC = await fromLegacyKeypair(recipient);

const { encryptedData, nonce, ephemeralPublicKey } = await encryptString(
  recipientWC.publicKey,
  "Hello, world!"
);

log("Encrypted data:", encryptedData);
log("Nonce:", nonce);
log("Ephemeral public key:", ephemeralPublicKey.toBase58());
