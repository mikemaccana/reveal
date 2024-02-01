// nacl is broken for es6
// we should stop using nackl and use web3.js anyway
// https://github.com/hakanols/tweetnacl-es6
import nacl from "./thirdparty/nacl-fast-es";

const log = console.log;

import { makeKeypairs } from "@solana-developers/helpers";

const [sender, recipient] = makeKeypairs(2);

const senderNACL = nacl.box.keyPair.fromSecretKey(sender.secretKey);
const recipientNACL = nacl.box.keyPair.fromSecretKey(recipient.secretKey);

const nonce = nacl.randomBytes(nacl.box.nonceLength);

const message = "secret";

const encoder = new TextEncoder();

const encryptedMessage = nacl.box(
  encoder.encode(message),
  nonce,
  recipientNACL.publicKey,
  senderNACL.secretKey
);

log("encryptedMessage", encryptedMessage);
