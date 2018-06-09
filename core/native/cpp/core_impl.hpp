#pragma once

#include "core.hpp"

namespace core {
    class CoreImpl: public core::Core {

    public:
        CoreImpl();

        std::string pbkdf2(const std::string & password, const std::string & salt, int32_t iterations, int8_t keylen, const std::string & digest);
        // std::string scrypt(const std::string & password, const std::string & salt, int32_t N, int32_t r, int32_t p, int8_t dklen);

    private:
        void bytesToHex(uint8_t * in, int inlen, char * out);
        bool hexToBytes(const char * string, uint8_t * outBytes);
    };
}
