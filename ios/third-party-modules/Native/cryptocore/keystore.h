#ifndef __KEY_H__
#define __KEY_H__

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include "constants.h"
#include "sha3.h"

#define VERSION_PUBLIC 0x0488b21e
#define VERSION_PRIVATE 0x0488ade4
#define XPRV_LENGTH 111
#define XPRV_STRING_LENGTH XPRV_LENGTH + 1
#define XPUB_LENGTH 111
#define XPUB_STRING_LENGTH XPUB_LENGTH + 1

typedef struct {
    uint8_t salt[32];
    uint32_t dklen;
    uint32_t c;
    char *prf;
} KdfPbkdf2Params;

typedef struct {
    uint8_t salt[32];
    uint32_t dklen;
    uint32_t n;
    uint32_t r;
    uint32_t p;
} KdfScryptParams;

typedef union {
    KdfScryptParams kdfScryptParams;
    KdfPbkdf2Params kdfPbkdf2Params;
} KdfParams;

typedef struct {
    char *name;
    Symbol symbol;
    Chain chain;
    Source source;
    char *mnemonicPath;
    AddressType addressType;
    bool isSegWit;
} KeystoreMeta;

typedef struct {
    uint8_t iv[16];
} CipherParams;

typedef struct {
    char *kfd;
    KdfParams kdfparams;
    uint8_t *ciphertext;
    char *cipher;
    uint8_t mac[SHA3_256_DIGEST_LENGTH];
    CipherParams cipherparams;
} KeystoreCrypto;

typedef struct {
    uint8_t *encStr;
    uint8_t nonce[16];
} EncryptedText;

typedef struct {
    uint8_t version;
    char *id;
    char *address;
    char xpub[XPUB_STRING_LENGTH];
    KeystoreCrypto crypto;
    KeystoreMeta meta;
    EncryptedText encMnemonic;
} Keystore;

typedef struct {
    uint8_t checksum[2];
    uint8_t keyHash[20];
} ScriptSig;

typedef struct {
    uint8_t p2shHeader;
    uint8_t segwitBytes[20];
} SegwitRawBytes;

typedef struct {
    uint8_t prefix;
    uint8_t keyHash[20];
} PublicKeySig;

typedef struct {
    AddressType addressType;
    bool isSegWit;
} WalletOptions;

void public_key_to_p2sh_p2wpkh_address(const uint8_t *publicKey, size_t publicKeyLen, char address[35]);
void public_key_to_p2wpkh_address(const uint8_t *publicKey, size_t publicKeyLen, char address[43]);
void public_key_to_classic_address(const uint8_t *publicKey, size_t publicKeyLen, char address[35]);

void create_crypto(const char *password, const uint8_t *in, size_t inlen, KdfType kdfType, KeystoreCrypto *crypto, uint8_t *derivedKey);
void encrypt_mnemonic(const uint8_t *derivedKey, size_t dlken, const uint8_t *data, size_t datalen, EncryptedText *encMnemonic);
void generate_mac(const uint8_t *derivedKey, size_t dlken, const uint8_t *cipherBuffer, size_t cipherLen, uint8_t digest[SHA3_256_DIGEST_LENGTH]);

void create_bitcoin_keystore_by_mnemonics(const char *mnemonic, const char *password, const WalletOptions *options, Keystore *keystore);
#endif
