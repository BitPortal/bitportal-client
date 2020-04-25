#ifndef __PRINT_H__
#define __PRINT_H__

#include <stdio.h>
#include <stdint.h>

void print_bits(const unsigned char* ptr);
void print_bits_of_uint32(uint32_t bit, const char* prefix);
void print_hash(const uint8_t *ptr, size_t len);

#endif
