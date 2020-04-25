#ifndef __HASH160_
#define __HASH160_

#include <stdint.h>
#include <stddef.h>
#include "ripemd160.h"

void hash160(const uint8_t *data, size_t length, uint8_t digest[RIPEMD160_DIGEST_LENGTH]);

#endif
