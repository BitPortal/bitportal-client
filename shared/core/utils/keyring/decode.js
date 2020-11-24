import assert from 'assert'
import { stringToU8a, u8aFixLength, u8aToBn } from '@polkadot/util';
import { naclDecrypt, scryptEncode, scryptFromU8a } from '@polkadot/util-crypto';
import { scrypt } from 'core/crypto'
import { ENCODING, NONCE_LENGTH, PKCS8_DIVIDER, PKCS8_HEADER, PUB_LENGTH, SEC_LENGTH, SEED_LENGTH, SCRYPT_LENGTH } from './defaults';

const SEED_OFFSET = PKCS8_HEADER.length;

function decodePkcs8 (encoded) {
  const header = encoded.subarray(0, PKCS8_HEADER.length);

  assert(header.toString() === PKCS8_HEADER.toString(), 'Invalid Pkcs8 header found in body');

  let secretKey = encoded.subarray(SEED_OFFSET, SEED_OFFSET + SEC_LENGTH);
  let divOffset = SEED_OFFSET + SEC_LENGTH;
  let divider = encoded.subarray(divOffset, divOffset + PKCS8_DIVIDER.length);

  // old-style, we have the seed here
  if (divider.toString() !== PKCS8_DIVIDER.toString()) {
    divOffset = SEED_OFFSET + SEED_LENGTH;
    secretKey = encoded.subarray(SEED_OFFSET, divOffset);
    divider = encoded.subarray(divOffset, divOffset + PKCS8_DIVIDER.length);
  }

  assert(divider.toString() === PKCS8_DIVIDER.toString(), 'Invalid Pkcs8 divider found in body');

  const pubOffset = divOffset + PKCS8_DIVIDER.length;
  const publicKey = encoded.subarray(pubOffset, pubOffset + PUB_LENGTH);

  return {
    publicKey,
    secretKey
  };
}

export async function decodePair (passphrase, encrypted, encType = ENCODING) {
  assert(encrypted, 'No encrypted data available to decode');
  assert(passphrase || !encType.includes('xsalsa20-poly1305'), 'Password required to decode encypted data');

  let encoded = encrypted;

  if (passphrase) {
    let password

    if (encType.includes('scrypt')) {
      const { params, salt } = scryptFromU8a(encrypted);
      // password = scryptEncode(passphrase, salt, params).password;
      const passwordHex = await scrypt(Buffer.from(passphrase).toString('hex'), Buffer.from(salt).toString('hex'), params.N, params.r, params.p, 64)
      password = new Uint8Array(Buffer.from(passwordHex, 'hex'))
      encrypted = encrypted.subarray(SCRYPT_LENGTH);
    } else {
      password = stringToU8a(passphrase);
    }

    encoded = naclDecrypt(
      encrypted.subarray(NONCE_LENGTH),
      encrypted.subarray(0, NONCE_LENGTH),
      u8aFixLength(password, 256, true)
    );
  }

  assert(encoded, 'Unable to decode using the supplied passphrase');

  return decodePkcs8(encoded);
}
