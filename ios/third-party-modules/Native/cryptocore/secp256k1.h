#ifndef __SECP256K1_H__
#define __SECP256K1_H__

#include <stdint.h>
#include "bip32.h"
#include "ecdsa.h"

extern const ecdsa_curve secp256k1;
extern const curve_info secp256k1_info;
extern const curve_info secp256k1_decred_info;
extern const curve_info secp256k1_groestl_info;
extern const curve_info secp256k1_smart_info;

#endif
