#ifndef __SCRYPT_H__
#define __SCRYPT_H__
#include <stdint.h>

#define rol32(a, b) (((a) << (b)) | ((a) >> (32 - (b))))

void ccscrypt(const uint8_t *pass, int passlen, const uint8_t *salt, int saltlen, uint64_t N, uint32_t r, uint32_t p, uint8_t *key, int keylen);

#endif
