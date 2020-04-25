#include "print.h"

const unsigned char bitmax[8] = {0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01};

const uint32_t bitmax_uint32[32] = {0x80000000, 0x40000000, 0x20000000, 0x10000000, 0x8000000, 0x4000000, 0x2000000, 0x1000000, 0x800000, 0x400000, 0x200000, 0x100000, 0x80000, 0x40000, 0x20000, 0x10000, 0x8000, 0x4000, 0x2000, 0x1000, 0x800, 0x400, 0x200, 0x100, 0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01};

void print_bits(const unsigned char* ptr) {
    for (int i = 0; i < 8; i++) {
        ((*ptr) & bitmax[i]) ? printf("1") : printf("0");
    }
    putchar( '\n' );
}

void print_bits_of_uint32(uint32_t bit, const char* prefix) {
    for (int i = 0; i < 32; i++) {
        ((bit) & bitmax_uint32[i]) ? printf("1") : printf("0");

        if (i == 7 || i == 15 || i == 23) {
            putchar('|');
        }
    }
    printf(", %s", prefix);

    putchar('\n');
}

void print_hash(const uint8_t *hash, size_t len) {
    for(int i = 0; i < len; i++) {
        printf("%02x", hash[i]);
    }
    putchar( '\n' );
}
