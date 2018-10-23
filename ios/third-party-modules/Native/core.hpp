// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from core.djinni

#pragma once

#include <cstdint>
#include <memory>
#include <string>

namespace core {

class Core {
public:
    virtual ~Core() {}

    static std::shared_ptr<Core> create();

    virtual std::string pbkdf2(const std::string & password, const std::string & salt, int32_t iterations, int8_t keylen, const std::string & digest) = 0;

    virtual std::string scrypt(const std::string & password, const std::string & salt, int32_t N, int8_t r, int8_t p, int8_t dkLen) = 0;
};

}  // namespace core