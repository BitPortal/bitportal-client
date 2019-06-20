#include "core_impl.hpp"
#include <string>

extern "C" {
#include "trezor-crypto/pbkdf2.h"
#include "trezor-crypto/bip32.h"
#include "trezor-crypto/curves.h"
#include "trezor-crypto/ecdsa.h"
#include "trezor-crypto/secp256k1.h"
#include "trezor-crypto/base58.h"
#include "trezor-crypto/hasher.h"
#include "trezor-crypto/memzero.h"
#include "crypto/crypto.h"
}

namespace core {
  std::shared_ptr<Core> Core::create() {
    return std::make_shared<CoreImpl>();
  }

  CoreImpl::CoreImpl() {}

  void CoreImpl::bytesToHex(uint8_t * in, int inlen, char * out) {
    uint8_t * pin = in;
    const char * hex = "0123456789abcdef";
    char * pout = out;
    for(; pin < in + inlen; pout += 2, pin++) {
      pout[0] = hex[(*pin>>4) & 0xF];
      pout[1] = hex[ *pin     & 0xF];
    }
    pout[0] = 0;
  }

  bool CoreImpl::hexToBytes(const char * string, uint8_t * outBytes) {
    uint8_t *data = outBytes;

    if(string == NULL)
      return false;

    size_t slength = strlen(string);
    if(slength % 2 != 0) // must be even
      return false;

    size_t dlength = slength / 2;
    std::memset(data, 0, dlength);
    size_t index = 0;
    while (index < slength) {
      char c = string[index];
      int value = 0;
      if(c >= '0' && c <= '9')
        value = (c - '0');
      else if (c >= 'A' && c <= 'F')
        value = (10 + (c - 'A'));
      else if (c >= 'a' && c <= 'f')
        value = (10 + (c - 'a'));
      else
        return false;

      data[(index/2)] += value << (((index + 1) % 2) * 4);

      index++;
    }

    return true;
  }

  std::string CoreImpl::pbkdf2(const std::string & password, const std::string & salt, int32_t iterations, int8_t keylen, const std::string & digest) {
    size_t passlen = std::strlen(password.c_str()) / 2;
    size_t saltlen = std::strlen(salt.c_str()) / 2;

    char *passwordString = (char *)(password.c_str());
    uint8_t passwordBytes[passlen];
    hexToBytes(passwordString, passwordBytes);

    char *saltString = (char *)(salt.c_str());
    uint8_t saltBytes[saltlen];
    hexToBytes(saltString, saltBytes);

    unsigned char key[keylen];

    if (digest == std::string("sha256")) {
      pbkdf2_hmac_sha256(passwordBytes, passlen, saltBytes, saltlen, (uint32_t) iterations, key);
    } else {
      pbkdf2_hmac_sha512(passwordBytes, passlen, saltBytes, saltlen, (uint32_t) iterations, key);
    }

    char keyHex[(keylen * 2) + 1];
    bytesToHex(key, sizeof(key), keyHex);
    return (std::string) keyHex;
  }

  std::string CoreImpl::scrypt(const std::string & password, const std::string & salt, int32_t N, int8_t r, int8_t p, int8_t dklen) {
    size_t passlen = std::strlen(password.c_str()) / 2;
    size_t saltlen = std::strlen(salt.c_str()) / 2;

    char *passwordString = (char *)(password.c_str());
    uint8_t passwordBytes[passlen];
    hexToBytes(passwordString, passwordBytes);

    char *saltString = (char *)(salt.c_str());
    uint8_t saltBytes[saltlen];
    hexToBytes(saltString, saltBytes);

    unsigned char key[dklen];

    BRScrypt(key, dklen, passwordBytes, passlen, saltBytes, saltlen, N, r, p);

    char keyHex[(dklen * 2) + 1];
    bytesToHex(key, sizeof(key), keyHex);
    return (std::string) keyHex;
  }
  
  std::vector<std::unordered_map<std::string, std::string>> CoreImpl::scanHDBTCAddresses(const std::string & xpub, int32_t startIndex, int32_t endIndex, bool isSegWit) {
    uint8_t buffer[78];
    base58_decode_check(xpub.c_str(), HASHER_SHA2D, buffer, 78);
    
    uint32_t depth = buffer[4];
    uint8_t chain_code[32];
    uint8_t public_key[33];
    uint8_t child_number_byte[4];
    memcpy(chain_code, buffer + 13, 32);
    memcpy(public_key, buffer + 45, 33);
    memcpy(child_number_byte, buffer + 9, 4);
    
    char child_number_hex[9];
    bytesToHex(child_number_byte, sizeof(child_number_byte), child_number_hex);
    uint32_t child_number = (int)strtol(child_number_hex, NULL, 16);
    
    HDNode root;
    hdnode_from_xpub(depth, child_number, chain_code, public_key, SECP256K1_NAME, &root);
    
    std::vector<std::unordered_map<std::string, std::string>> addresses;
    HDNode node;
    char address[MAX_ADDR_SIZE];
    curve_point pub;
    
    for (int i = startIndex; i <= endIndex; i++) {
      memcpy(&node, &root, sizeof(HDNode));
      
      hdnode_public_ckd(&node, 0);
      hdnode_fill_public_key(&node);
      ecdsa_read_pubkey(&secp256k1, node.public_key, &pub);
      hdnode_public_ckd_address_optimized(&pub, node.chain_code, i, isSegWit ? 0x05 : 0, HASHER_SHA2, HASHER_SHA2D, address, sizeof(address), isSegWit);
      
      std::unordered_map<std::string, std::string> addressInfo;
      addressInfo["address"] = address;
      addressInfo["change"] = std::to_string(0);
      addressInfo["index"] = std::to_string(i);
      addresses.push_back(addressInfo);
    }
    
    for (int i = startIndex; i <= endIndex; i++) {
      memcpy(&node, &root, sizeof(HDNode));
      
      hdnode_public_ckd(&node, 1);
      hdnode_fill_public_key(&node);
      ecdsa_read_pubkey(&secp256k1, node.public_key, &pub);
      hdnode_public_ckd_address_optimized(&pub, node.chain_code, i, isSegWit ? 0x05 : 0, HASHER_SHA2, HASHER_SHA2D, address, sizeof(address), isSegWit);
      
      std::unordered_map<std::string, std::string> addressInfo;
      addressInfo["address"] = address;
      addressInfo["change"] = std::to_string(1);
      addressInfo["index"] = std::to_string(i);
      addresses.push_back(addressInfo);
    }
    
    memzero(chain_code, 32);
    memzero(public_key, 33);
    memzero(child_number_byte, 4);
    return addresses;
  }

  std::string CoreImpl::pbkdf2Legacy(const std::string & password, const std::string & salt, int32_t iterations, int8_t keylen, const std::string & digest) {
    const uint8_t *passwordBytes = (unsigned char *)(password.c_str());
    const uint8_t *saltBytes = (unsigned char *)(salt.c_str());
    size_t passlen = std::strlen(password.c_str());
    size_t saltlen = std::strlen(salt.c_str());

    unsigned char key[keylen];

    if (digest == std::string("sha256")) {
      pbkdf2_hmac_sha256(passwordBytes, passlen, saltBytes, saltlen, (uint32_t) iterations, key);
    } else {
      pbkdf2_hmac_sha512(passwordBytes, passlen, saltBytes, saltlen, (uint32_t) iterations, key);
    }

    char keyHex[(keylen * 2) + 1];
    bytesToHex(key, sizeof(key), keyHex);
    return (std::string) keyHex;
  }

  std::string CoreImpl::scryptLegacy(const std::string & password, const std::string & salt, int32_t N, int8_t r, int8_t p, int8_t dklen) {
    const uint8_t *passwordBytes = (unsigned char *)(password.c_str());
    const uint8_t *saltBytes = (unsigned char *)(salt.c_str());
    size_t passlen = std::strlen(password.c_str());
    size_t saltlen = std::strlen(salt.c_str());

    unsigned char key[dklen];

    BRScrypt(key, dklen, passwordBytes, passlen, saltBytes, saltlen, N, r, p);

    char keyHex[(dklen * 2) + 1];
    bytesToHex(key, sizeof(key), keyHex);
    return (std::string) keyHex;
  }
}
