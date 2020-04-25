#include <stdio.h>
#include <string.h>
#include <time.h>
#include "wallet.h"
#include "keystore.h"
#include "print.h"

void createWallet() {
    /* clock_t start = clock(); */
    char *mnemonics = "snow provide whip cigar exit cattle double market tragic error salt under";
    char *password = "12345678";
    WalletOptions options = {
        .addressType = P2SH_P2WPKH_ADDRESS,
        .isSegWit = true
    };
    Keystore keystore = {0};
    create_bitcoin_keystore_by_mnemonics(mnemonics, password, &options, &keystore);
    /* clock_t end = clock(); */
    /* printf("Time Cost: %lums\n", (end - start) * 1000 / CLOCKS_PER_SEC); */
    printf("keystore size: %lu\n\n", sizeof(keystore));
    printf("version: %i\n", keystore.version);
    printf("address: %s\n", keystore.address);
    printf("xpub: %s\n", keystore.xpub);
    printf("meta.name: %s\n", keystore.meta.name);
    printf("meta.isSegWit: %i\n", keystore.meta.isSegWit);
    printf("meta.mnemonicPath: %s\n", keystore.meta.mnemonicPath);
    printf("meta.chain: %i\n", keystore.meta.chain);
    printf("meta.symbol: %i\n", keystore.meta.symbol);
    printf("meta.source: %i\n", keystore.meta.source);
    printf("crypto.cipher: %s\n", keystore.crypto.cipher);
    printf("crypto.kfd: %s\n", keystore.crypto.kfd);
    printf("crypto.cipherparams.iv: ");
    print_hash(keystore.crypto.cipherparams.iv, sizeof(keystore.crypto.cipherparams.iv));
    printf("crypto.mac: ");
    print_hash(keystore.crypto.mac, sizeof(keystore.crypto.mac));

    if (!strcmp(keystore.crypto.kfd, (char *)"pbkdf2")) {
        printf("crypto.kdfparams.kdfPbkdf2Params.dklen: %u\n", keystore.crypto.kdfparams.kdfPbkdf2Params.dklen);
        printf("crypto.kdfparams.kdfPbkdf2Params.c: %u\n", keystore.crypto.kdfparams.kdfPbkdf2Params.c);
        printf("crypto.kdfparams.kdfPbkdf2Params.prf: %s\n", keystore.crypto.kdfparams.kdfPbkdf2Params.prf);
        printf("crypto.kdfparams.kdfPbkdf2Params.salt: ");
        print_hash(keystore.crypto.kdfparams.kdfPbkdf2Params.salt, sizeof(keystore.crypto.kdfparams.kdfPbkdf2Params.salt));
        printf("keystore.crypto.ciphertext: ");
        print_hash(keystore.crypto.ciphertext, XPRV_LENGTH);
    } else if (!strcmp(keystore.crypto.kfd, (char *)"scrypt")) {
        printf("crypto.kdfparams.kdfScryptParams.dklen: %u\n", keystore.crypto.kdfparams.kdfScryptParams.dklen);
        printf("crypto.kdfparams.kdfScryptParams.n: %u\n", keystore.crypto.kdfparams.kdfScryptParams.n);
        printf("crypto.kdfparams.kdfScryptParams.p: %u\n", keystore.crypto.kdfparams.kdfScryptParams.p);
        printf("crypto.kdfparams.kdfScryptParams.r: %u\n", keystore.crypto.kdfparams.kdfScryptParams.r);
        printf("crypto.kdfparams.kdfPbkdf2Params.salt: ");
        print_hash(keystore.crypto.kdfparams.kdfScryptParams.salt, sizeof(keystore.crypto.kdfparams.kdfScryptParams.salt));
        printf("keystore.crypto.ciphertext: ");
        print_hash(keystore.crypto.ciphertext, XPRV_LENGTH);
    }

    printf("keystore.encMnemonic.encStr: ");
    print_hash(keystore.encMnemonic.encStr, strlen(mnemonics));
    printf("keystore.encMnemonic.nonce: ");
    print_hash(keystore.encMnemonic.nonce, sizeof(keystore.encMnemonic.nonce));
}
