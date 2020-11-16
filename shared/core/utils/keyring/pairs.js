import assert from 'assert';
import { isHex, isU8a, u8aToHex, u8aToU8a } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

export class Pairs {
  #map = {};

  add (pair) {
    this.#map[decodeAddress(pair.address).toString()] = pair;
    return pair;
  }

  all () {
    return Object.values(this.#map);
  }

  get (address) {
    const pair = this.#map[decodeAddress(address).toString()];

    assert(pair, () => {
      const formatted = isU8a(address) || isHex(address)
        ? u8aToHex(u8aToU8a(address))
        : address;

      return `Unable to retrieve keypair '${formatted}'`;
    });

    return pair;
  }

  remove (address) {
    delete this.#map[decodeAddress(address).toString()];
  }
}
