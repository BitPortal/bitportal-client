#include <stdlib.h>
#include <string.h>
#include "hex.h"

const char *HEX_ALPHABET = "0123456789abcdef";

void bytes_to_hex(uint8_t *bytes, size_t byetsLen, char *hex) {
    char *pout = hex;
    uint8_t *pin = bytes;

    for (; pin < bytes + byetsLen; pout += 2, pin++) {
        pout[0] = HEX_ALPHABET[(*pin >> 4) & 0xf];
        pout[1] = HEX_ALPHABET[*pin & 0xf];
    }

    pout[0] = '\0';
}

char *hex_from_bytes(uint8_t *bytes, size_t bytesLen) {
    char *hex = malloc(bytesLen * 2 * sizeof(char) + 1);
    char *pout = hex;
    uint8_t *pin = bytes;

    for (; pin < bytes + bytesLen; pout += 2, pin++) {
        pout[0] = HEX_ALPHABET[(*pin >> 4) & 0xf];
        pout[1] = HEX_ALPHABET[*pin & 0xf];
    }

    pout[0] = '\0';
    return hex;
}

void hex_to_bytes(char *hex, size_t hexLen, uint8_t *bytes) {
    if (hexLen % 2 != 0) {
        return;
    }

    char *pin = hex;
    uint8_t *pout = bytes;

    for (; pin < hex + hexLen; pin += 2, pout++) {
        char hexs[3] = {pin[0], pin[1]};
        pout[0] = (uint8_t)strtol(hexs, NULL, 16);
    }
}

uint8_t *bytes_from_hex(char *hex, size_t hexLen) {
    if (hexLen % 2 != 0) {
        return NULL;
    }

    char *pin = hex;
    uint8_t *bytes = malloc((hexLen % 2) * sizeof(uint8_t));
    uint8_t *pout = bytes;

    for (; pin < hex + hexLen; pin += 2, pout++) {
        char hexs[3] = {pin[0], pin[1]};
        pout[0] = (uint8_t)strtol(hexs, NULL, 16);
    }

    return bytes;
}
