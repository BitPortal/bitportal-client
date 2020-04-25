#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <time.h>
#include "keystore.h"
#include "hash160.h"
#include "memzero.h"
#include "base58.h"
#include "hasher.h"
#include "segwit_addr.h"
#include "bip39.h"
#include "bip32.h"
#include "curves.h"
#include "randombytes.h"
#include "aes/aes.h"
#include "scrypt.h"
#include "pbkdf2.h"
#include "print.h"

void public_key_to_p2sh_p2wpkh_address(const uint8_t *publicKey, size_t publicKeyLen, char *address) {
    ScriptSig scriptSig = {0};
    SegwitRawBytes segwitRawBytes = {0};

    scriptSig.checksum[0] = 0;
    scriptSig.checksum[1] = 20;
    segwitRawBytes.p2shHeader = 5;

    hash160(publicKey, publicKeyLen, scriptSig.keyHash);
    hash160((uint8_t *)&scriptSig, sizeof(scriptSig), segwitRawBytes.segwitBytes);
    base58_encode_check((uint8_t *)&segwitRawBytes, sizeof(segwitRawBytes), HASHER_SHA2D, address, 35);

    memzero(&scriptSig, sizeof(scriptSig));
    memzero(&segwitRawBytes, sizeof(segwitRawBytes));
}

void public_key_to_p2wpkh_address(const uint8_t *publicKey, size_t publicKeyLen, char *address) {
    char hrp[3] = "bc";
    int version = 0;
    uint8_t program[20] = {0};

    hash160(publicKey, publicKeyLen, program);
    segwit_addr_encode(address, hrp, version, program, sizeof(program));

    memzero(program, sizeof(program));
    memzero(hrp, sizeof(hrp));
}

void public_key_to_classic_address(const uint8_t *publicKey, size_t publicKeyLen, char *address) {
    PublicKeySig publicKeySig = {0};
    publicKeySig.prefix = 0;

    hash160(publicKey, publicKeyLen, publicKeySig.keyHash);
    base58_encode_check((uint8_t *)&publicKeySig, sizeof(publicKeySig), HASHER_SHA2D, address, 35);

    memzero(&publicKeySig, sizeof(publicKeySig));
}

void create_bitcoin_keystore_by_mnemonics(const char *mnemonic, const char *password, const WalletOptions *options, Keystore *keystore) {
    uint8_t seed[64] = {0};
    HDNode node = {0};

    mnemonic_to_seed(mnemonic, "", seed, NULL);
    hdnode_from_seed(seed, 64, SECP256K1_NAME, &node);

    void (*public_key_to_address)(const uint8_t *, size_t, char *) = NULL;
    uint8_t coinType = options->isSegWit ? 49 : 44;
    uint8_t addressLen = 0;

    if (options->isSegWit) {
        if (options->addressType == P2SH_P2WPKH_ADDRESS) {
            public_key_to_address = &public_key_to_p2sh_p2wpkh_address;
            addressLen = 35;
        } else {
            public_key_to_address = &public_key_to_p2wpkh_address;
            addressLen = 43;
        }
    } else {
        public_key_to_address = &public_key_to_classic_address;
        addressLen = 35;
    }

    keystore->address = malloc(addressLen * sizeof(char));

    hdnode_private_ckd_prime(&node, coinType);
    hdnode_private_ckd_prime(&node, 0);
    uint32_t fingerprint = hdnode_fingerprint(&node);
    hdnode_private_ckd_prime(&node, 0);
    hdnode_fill_public_key(&node);

    char xprv[XPRV_STRING_LENGTH];
    hdnode_serialize_private(&node, fingerprint, VERSION_PRIVATE, xprv, XPRV_STRING_LENGTH);
    hdnode_serialize_public(&node, fingerprint, VERSION_PUBLIC, keystore->xpub, XPUB_STRING_LENGTH);

    hdnode_private_ckd(&node, 0);
    hdnode_private_ckd(&node, 0);
    hdnode_fill_public_key(&node);

    public_key_to_address(node.public_key, sizeof(node.public_key), keystore->address);

    uint8_t *xprvBytes = (uint8_t *)xprv;
    uint8_t derivedKey[32] = {0};
    create_crypto(password, xprvBytes, XPRV_LENGTH, SCRYPT, &keystore->crypto, derivedKey);

    int mnemonicLen = strlen(mnemonic);
    encrypt_mnemonic(derivedKey, sizeof(derivedKey), (uint8_t *)mnemonic, mnemonicLen, &keystore->encMnemonic);

    keystore->version = 1;
    KeystoreMeta meta = {
        .name = "BTC-Wallet",
        .symbol = BTC_SYMBOL,
        .chain = BITCOIN_CHAIN,
        .source = MNEMONICS,
        .mnemonicPath = "m/49'/0'/0'",
        .isSegWit = options->isSegWit,
        .addressType = options->addressType
    };
    keystore->meta = meta;
    memzero(&node, sizeof(HDNode));
    memzero(seed, sizeof(seed));
    memzero(derivedKey, sizeof(derivedKey));
}

void derive_key(const char *password, KdfType kdfType, KdfParams *kdfParams, uint8_t *derivedKey) {
    if (kdfType == PBKDF2) {
        pbkdf2_hmac_sha256(
            (const uint8_t *)password,
            strlen(password),
            kdfParams->kdfPbkdf2Params.salt,
            sizeof(kdfParams->kdfPbkdf2Params.salt),
            kdfParams->kdfPbkdf2Params.c,
            derivedKey,
            kdfParams->kdfPbkdf2Params.dklen
        );
    } else if (kdfType == SCRYPT) {
        ccscrypt(
            (const uint8_t *)password,
            strlen(password),
            kdfParams->kdfScryptParams.salt,
            sizeof(kdfParams->kdfScryptParams.salt),
            kdfParams->kdfScryptParams.n,
            kdfParams->kdfScryptParams.r,
            kdfParams->kdfScryptParams.p,
            derivedKey,
            kdfParams->kdfPbkdf2Params.dklen
        );
    } else {
        printf("Unsupported kdf type");
        abort();
    }
}

void encrypt_mnemonic(const uint8_t *derivedKey, size_t dlken, const uint8_t *data, size_t datalen, EncryptedText *encMnemonic) {
    uint8_t nonce[16] = {0};
    randombytes_buf(nonce, 16);
    memcpy(encMnemonic->nonce, nonce, 16);

    aes_encrypt_ctx ctxe = {0};
    aes_encrypt_key128(derivedKey, &ctxe);

    uint8_t *encStr = malloc(datalen * sizeof(uint8_t));
    assert(encStr && "encStr malloc failed");
    aes_ctr_encrypt(data, encStr, (int)datalen, nonce, aes_ctr_cbuf_inc, &ctxe); // nonce will be changed
    encMnemonic->encStr = encStr;
    memzero(&ctxe, sizeof(ctxe));
}

void create_crypto(const char *password, const uint8_t *in, size_t inlen, KdfType kdfType, KeystoreCrypto *crypto, uint8_t *derivedKey) {
    uint8_t salt[32] = {0};
    randombytes_buf(salt, 32);

    if (kdfType == PBKDF2) {
        crypto->kfd = "pbkdf2";
        memcpy(crypto->kdfparams.kdfPbkdf2Params.salt, salt, 32);
        crypto->kdfparams.kdfPbkdf2Params.dklen = 32;
        crypto->kdfparams.kdfPbkdf2Params.c = 65535;
        crypto->kdfparams.kdfPbkdf2Params.prf = "hmac-sha256";

        pbkdf2_hmac_sha256(
            (const uint8_t *)password,
            strlen(password),
            crypto->kdfparams.kdfPbkdf2Params.salt,
            sizeof(crypto->kdfparams.kdfPbkdf2Params.salt),
            crypto->kdfparams.kdfPbkdf2Params.c,
            derivedKey,
            32
        );
    } else if (kdfType == SCRYPT) {
        crypto->kfd = "scrypt";
        memcpy(crypto->kdfparams.kdfScryptParams.salt, salt, 32);
        crypto->kdfparams.kdfScryptParams.dklen = 32;
        crypto->kdfparams.kdfScryptParams.n = 262144;
        crypto->kdfparams.kdfScryptParams.r = 8;
        crypto->kdfparams.kdfScryptParams.p = 1;

        clock_t start = clock();
        ccscrypt(
            (const uint8_t *)password,
            strlen(password),
            crypto->kdfparams.kdfScryptParams.salt,
            sizeof(crypto->kdfparams.kdfScryptParams.salt),
            crypto->kdfparams.kdfScryptParams.n,
            crypto->kdfparams.kdfScryptParams.r,
            crypto->kdfparams.kdfScryptParams.p,
            derivedKey,
            32
        );
        clock_t end = clock();
        printf("Scrypt Time Cost: %lums\n", (end - start) * 1000 / CLOCKS_PER_SEC);
    } else {
        printf("Unsupported kdf type");
        abort();
    }

    uint8_t iv[16] = {0};
    randombytes_buf(iv, 16);
    memcpy(crypto->cipherparams.iv, iv, 16);

    aes_encrypt_ctx ctxe = {0};
    aes_encrypt_key128(derivedKey, &ctxe);

    uint8_t *out = malloc(inlen * sizeof(uint8_t));
    assert(out && "out malloc failed!");
    aes_ctr_encrypt(in, out, (int)inlen, iv, aes_ctr_cbuf_inc, &ctxe); // iv will be changed
    crypto->ciphertext = out;
    crypto->cipher = "aes-128-ctr";

    generate_mac(derivedKey, 32, crypto->ciphertext, inlen, crypto->mac);

    printf("derivedKey: ");
    print_hash(derivedKey, 32);

    memzero(salt, sizeof(salt));
    memzero(iv, sizeof(iv));
    memzero(&ctxe, sizeof(ctxe));
}

void generate_mac(const uint8_t *derivedKey, size_t dlken, const uint8_t *cipherBuffer, size_t cipherLen, uint8_t digest[SHA3_256_DIGEST_LENGTH]) {
    size_t dataLen = dlken - 16 + cipherLen;
    uint8_t *data = malloc(dataLen * sizeof(uint8_t));
    assert(data && "data malloc failed!");
    memcpy(data, derivedKey + 16, 16);
    memcpy(data + 16, cipherBuffer, cipherLen);
    keccak_256(data, dataLen, digest);
    free(data);
}
