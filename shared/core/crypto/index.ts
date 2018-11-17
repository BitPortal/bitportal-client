import randomBytes from 'core/crypto/randomBytes'
import pbkdf2 from 'core/crypto/pbkdf2'
import scrypt from 'core/crypto/scrypt'
import keccak256 from 'core/crypto/keccak256'
import bip39 from 'core/crypto/bip39'
import { createHash } from 'crypto'

const ripemd160 = (buffer: any) => {
  return createHash('rmd160').update(buffer).digest()
}

const sha1 = (buffer: any) => {
  return createHash('sha1').update(buffer).digest()
}

const sha256 = (buffer: any) => {
  return createHash('sha256').update(buffer).digest()
}

const hash160 = (buffer: any) => {
  return ripemd160(sha256(buffer))
}

const hash256 = (buffer: any) => {
  return sha256(sha256(buffer))
}

export {
  randomBytes,
  pbkdf2,
  scrypt,
  keccak256,
  bip39,
  hash256,
  hash160,
  sha256,
  sha1,
  ripemd160
}
