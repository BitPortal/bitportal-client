#include "hash160.h"
#include "sha2.h"
#include "memzero.h"

void hash160(const uint8_t *data, size_t length, uint8_t digest[RIPEMD160_DIGEST_LENGTH]) {
    uint8_t sha2Hash[SHA256_DIGEST_LENGTH] = {0};

    sha256_Raw(data, length, sha2Hash);
    ripemd160(sha2Hash, sizeof(sha2Hash), digest);

    memzero(sha2Hash, sizeof(sha2Hash));
}
