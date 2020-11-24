import { u8aConcat, assert } from '@polkadot/util';
import { naclEncrypt, scryptEncode, scryptToU8a,cryptoWaitReady } from '@polkadot/util-crypto';

import { PKCS8_DIVIDER, PKCS8_HEADER } from './defaults';
import randomBytes from 'core/crypto/randomBytes'

export const encodePair = async ({ publicKey, secretKey }, passphrase) => {
  assert(secretKey, 'Expected a valid secretKey to be passed to encode');

  await cryptoWaitReady()
  const encoded = u8aConcat(
    PKCS8_HEADER,
    secretKey,
    PKCS8_DIVIDER,
    publicKey
  );

  if (!passphrase) {
    return encoded;
  }

  console.log('----> encodePair scryptEncode start ')
  const { params, password, salt } = scryptEncode(passphrase, new Uint8Array(await randomBytes(32)));
  console.log('----> encodePair scryptEncode result ',salt, params, password)
  const { encrypted, nonce } = naclEncrypt(encoded, password.subarray(0, 32), new Uint8Array(await randomBytes(24)));
  console.log('----> encodePair naclEncrypt result ',encrypted, nonce)
   const r = u8aConcat(scryptToU8a(salt, params), nonce, encrypted); 
  console.log('----> encodePair u8aConcat result ',r)
  return r
}
