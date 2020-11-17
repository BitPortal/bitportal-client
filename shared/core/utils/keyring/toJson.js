import { base64Encode } from '@polkadot/util-crypto';

import { ENCODING } from './defaults';

// version 2 - nonce, encoded (previous)
// version 3 - salt, nonce, encoded
const VERSION = '3';

const ENC_NONE = ['none'];

export function pairToJson (type, { address, meta }, encoded, isEncrypted) {
  return {
    address,
    encoded: base64Encode(encoded),
    encoding: {
      content: ['pkcs8', type],
      type: isEncrypted
        ? ENCODING
        : ENC_NONE,
      version: VERSION
    },
    meta
  };
}
