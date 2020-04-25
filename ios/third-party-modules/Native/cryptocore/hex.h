#ifndef __HEX_H__
#define __HEX_H__

#include <stdint.h>

extern const char *HEX_ALPHABET;

void bytes_to_hex(uint8_t *bytes, size_t byetsLen, char *hex);
char *hex_from_bytes(uint8_t *bytes, size_t byetsLen);

void hex_to_bytes(char *hex, size_t hexLen, uint8_t *bytes);
uint8_t *bytes_from_hex(char *hex, size_t hexLen);

#endif
