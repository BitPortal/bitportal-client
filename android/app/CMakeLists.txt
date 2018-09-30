cmake_minimum_required(VERSION 3.4.1)

file(GLOB core_sources
    ../../tools/djinni/support-lib/jni/*.cpp
    ../../shared/core/djinni/jni/*.cpp
    ../../shared/core/native/cpp/*.cpp
    ../../shared/core/native/cpp/crypto/*.c
    ../../shared/core/native/cpp/trezor-crypto/*.c
    ../../shared/core/native/cpp/trezor-crypto/aes/*.c
    ../../shared/core/native/cpp/trezor-crypto/chacha20poly1305/*.c
    ../../shared/core/native/cpp/trezor-crypto/ed25519-donna/*.c
)

add_library(core SHARED ${core_sources})

# include directories for header files
include_directories(
    ../../tools/djinni/support-lib/
    ../../tools/djinni/support-lib/jni/
    ../../shared/core/djinni/cpp/
    ../../shared/core/djinni/jni/
    ../../shared/core/native/cpp/crypto/
    ../../shared/core/native/cpp/trezor-crypto/
    ../../shared/core/native/cpp/trezor-crypto/aes/
    ../../shared/core/native/cpp/trezor-crypto/chacha20poly1305/
    ../../shared/core/native/cpp/trezor-crypto/ed25519-donna/
)

target_link_libraries(core)
