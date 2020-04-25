#include <stdlib.h>
#include <string.h>
#include "scrypt.h"
#include "pbkdf2.h"
#include "memzero.h"

static void salsa20_8(uint32_t b[16]) {
    uint32_t x0 = b[0], x1 = b[1], x2 = b[2],  x3 = b[3],  x4 = b[4],  x5 = b[5],  x6 = b[6],  x7 = b[7], x8 = b[8], x9 = b[9], xa = b[10], xb = b[11], xc = b[12], xd = b[13], xe = b[14], xf = b[15];

    for (uint32_t i = 0; i < 8; i += 2) {
        x4 ^= rol32(x0 + xc, 7), x8 ^= rol32(x4 + x0, 9), xc ^= rol32(x8 + x4, 13), x0 ^= rol32(xc + x8, 18);
        x9 ^= rol32(x5 + x1, 7), xd ^= rol32(x9 + x5, 9), x1 ^= rol32(xd + x9, 13), x5 ^= rol32(x1 + xd, 18);
        xe ^= rol32(xa + x6, 7), x2 ^= rol32(xe + xa, 9), x6 ^= rol32(x2 + xe, 13), xa ^= rol32(x6 + x2, 18);
        x3 ^= rol32(xf + xb, 7), x7 ^= rol32(x3 + xf, 9), xb ^= rol32(x7 + x3, 13), xf ^= rol32(xb + x7, 18);

        x1 ^= rol32(x0 + x3, 7), x2 ^= rol32(x1 + x0, 9), x3 ^= rol32(x2 + x1, 13), x0 ^= rol32(x3 + x2, 18);
        x6 ^= rol32(x5 + x4, 7), x7 ^= rol32(x6 + x5, 9), x4 ^= rol32(x7 + x6, 13), x5 ^= rol32(x4 + x7, 18);
        xb ^= rol32(xa + x9, 7), x8 ^= rol32(xb + xa, 9), x9 ^= rol32(x8 + xb, 13), xa ^= rol32(x9 + x8, 18);
        xc ^= rol32(xf + xe, 7), xd ^= rol32(xc + xf, 9), xe ^= rol32(xd + xc, 13), xf ^= rol32(xe + xd, 18);
    }

    b[0] += x0, b[1] += x1, b[2] += x2,  b[3] += x3,  b[4] += x4,  b[5] += x5,  b[6] += x6,  b[7] += x7;
    b[8] += x8, b[9] += x9, b[10] += xa, b[11] += xb, b[12] += xc, b[13] += xd, b[14] += xe, b[15] += xf;
}

static void blockmix_salsa8(uint64_t *dest, const uint64_t *src, uint64_t *b, uint32_t r) {
    memcpy(b, &src[(2 * r - 1) * 8], 64);

    for (uint32_t i = 0; i < 2 * r; i += 2) {
        for (uint32_t j = 0; j < 8; j++) b[j] ^= src[i * 8 + j];
        salsa20_8((uint32_t *)b);
        memcpy(&dest[i * 4], b, 64);
        for (uint32_t j = 0; j < 8; j++) b[j] ^= src[i * 8 + 8 + j];
        salsa20_8((uint32_t *)b);
        memcpy(&dest[i * 4 + r * 8], b, 64);
    }
}

void ccscrypt(const uint8_t *password, int passwordlen, const uint8_t *salt, int saltlen, uint64_t N, uint32_t r, uint32_t p, uint8_t *key, int keylen) {
    uint64_t x[16 * r], y[16 * r], z[8], *v = malloc(128 * r * N), m;
    uint32_t blocks[32 * r * p];

    pbkdf2_hmac_sha256(password, passwordlen, salt, saltlen, 1, (uint8_t *)blocks, sizeof(blocks));

    for (uint32_t i = 0; i < p; i++) {
        for (uint32_t j = 0; j < 32 * r; j++) {
#if BYTE_ORDER != LITTLE_ENDIAN
            REVERSE32(blocks[i * 32 * r + j], blocks[i * 32 * r + j]);
#endif
            ((uint32_t *)x)[j] = blocks[i * 32 * r + j];
        }

        for (uint32_t j = 0; j < N; j += 2) {
            memcpy(&v[j * (16 * r)], x, 128 * r);
            blockmix_salsa8(y, x, z, r);
            memcpy(&v[(j + 1) * (16 * r)], y, 128 * r);
            blockmix_salsa8(x, y, z, r);
        }

        for (uint32_t j = 0; j < N; j += 2) {
            m = x[(2 * r - 1) * 8] & (N - 1);
#if BYTE_ORDER != LITTLE_ENDIAN
            REVERSE64(m, m);
#endif
            for (uint32_t k = 0; k < 16 * r; k++) x[k] ^= v[m * (16 * r) + k];
            blockmix_salsa8(y, x, z, r);
            m = y[(2 * r - 1) * 8] & (N - 1);
#if BYTE_ORDER != LITTLE_ENDIAN
            REVERSE64(m, m);
#endif
            for (uint32_t k = 0; k < 16 * r; k++) y[k] ^= v[m * (16 * r) + k];
            blockmix_salsa8(x, y, z, r);
        }

        for (uint32_t j = 0; j < 32 * r; j++) {
#if BYTE_ORDER != LITTLE_ENDIAN
            REVERSE32(((uint32_t *)x)[j], ((uint32_t *)x)[j]);
#endif
            blocks[i * 32 * r + j] = ((uint32_t *)x)[j];
        }
    }

    pbkdf2_hmac_sha256(password, passwordlen, (uint8_t *)blocks, sizeof(blocks), 1, key, keylen);

    memzero(blocks, sizeof(blocks));
    memzero(x, sizeof(x));
    memzero(y, sizeof(y));
    memzero(z, sizeof(z));
    free(v);
}
