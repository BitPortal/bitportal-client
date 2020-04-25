#ifndef __ADDRESS_H__
#define __ADDRESS_H__

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include "options.h"

size_t address_prefix_bytes_len(uint32_t address_type);
void address_write_prefix_bytes(uint32_t address_type, uint8_t *out);
bool address_check_prefix(const uint8_t *addr, uint32_t address_type);
#if USE_ETHEREUM
void ethereum_address_checksum(const uint8_t *addr, char *address, bool rskip60, uint32_t chain_id);
#endif

#endif
