#include "core_impl.hpp"
#include <string>

extern "C" {
  #include "trezor-crypto/pbkdf2.h"
  // #include "scrypt/crypto_scrypt.h"
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
        for(; pin < in + inlen; pout += 2, pin++){
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
        const uint8_t *passwordBytes = (unsigned char *)(password.c_str());
        const uint8_t *saltBytes = (unsigned char *)(salt.c_str());
        uint8_t passlen = std::strlen(password.c_str());
        uint8_t saltlen = std::strlen(salt.c_str());
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

    // std::string CoreImpl::scrypt(const std::string & password, const std::string & salt, int32_t N, int32_t r, int32_t p, int8_t dklen) {
    //     const uint8_t *passwordBytes = (unsigned char *)(password.c_str());
    //     const uint8_t *saltBytes = (unsigned char *)(salt.c_str());
    //     size_t passlen = std::strlen(password.c_str());
    //     size_t saltlen = std::strlen(salt.c_str());

    //     unsigned char key[dklen];

    //     crypto_scrypt(passwordBytes, passlen, saltBytes, saltlen, N, r, p, key, dklen);

    //     char keyHex[(dklen * 2) + 1];
    //     bytesToHex(key, sizeof(key), keyHex);
    //     return (std::string) keyHex;
    // }
}
