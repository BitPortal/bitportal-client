cmake_minimum_required(VERSION 3.4.1)

file(GLOB core_sources
    ../../tools/djinni/support-lib/jni/*.cpp
    ../../core/djinni/jni/*.cpp
    ../../core/native/cpp/*.cpp
    ../../core/native/cpp/trezor-crypto/*.c
    ../../core/native/cpp/trezor-crypto/aes/*.c
    ../../core/native/cpp/trezor-crypto/chacha20poly1305/*.c
    ../../core/native/cpp/trezor-crypto/ed25519-donna/*.c
)

add_library(core SHARED ${core_sources})

# include directories for header files
include_directories(
    ../../tools/djinni/support-lib/
    ../../tools/djinni/support-lib/jni/
    ../../core/djinni/cpp/
    ../../core/djinni/jni/
    ../../core/native/cpp/trezor-crypto/
    ../../core/native/cpp/trezor-crypto/aes/
    ../../core/native/cpp/trezor-crypto/chacha20poly1305/
    ../../core/native/cpp/trezor-crypto/ed25519-donna/
)

target_link_libraries(core)
