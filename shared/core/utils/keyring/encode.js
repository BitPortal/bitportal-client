import { u8aConcat, assert } from '@polkadot/util';
import { naclEncrypt, scryptEncode, scryptToU8a } from '@polkadot/util-crypto';
import { scrypt } from 'core/crypto'
import randomBytes from 'core/crypto/randomBytes'
import { PKCS8_DIVIDER, PKCS8_HEADER } from './defaults';

export const encodePair = async ({ publicKey, secretKey }, passphrase) => {
  assert(secretKey, 'Expected a valid secretKey to be passed to encode');

  const encoded = u8aConcat(
    PKCS8_HEADER,
    secretKey,
    PKCS8_DIVIDER,
    publicKey
  );

  if (!passphrase) {
    return encoded;
  }

  const params = {
    N: 1 << 15,
    p: 1,
    r: 8
  }
  const salt = new Uint8Array(await randomBytes(32))
  const passwordHex = await scrypt(Buffer.from(passphrase).toString('hex'), Buffer.from(salt).toString('hex'), params.N, params.r, params.p, 64)
  const password = new Uint8Array(Buffer.from(passwordHex, 'hex'))

  const { encrypted, nonce } = naclEncrypt(encoded, password.subarray(0, 32), new Uint8Array(await randomBytes(24)));

  return u8aConcat(scryptToU8a(salt, params), nonce, encrypted);
}
