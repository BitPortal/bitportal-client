// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from core.djinni

#include "NativeCore.hpp"  // my header
#include "Marshal.hpp"

namespace djinni_generated {

NativeCore::NativeCore() : ::djinni::JniInterface<::core::Core, NativeCore>("com/bitportal/core/Core$CppProxy") {}

NativeCore::~NativeCore() = default;


CJNIEXPORT void JNICALL Java_com_bitportal_core_Core_00024CppProxy_nativeDestroy(JNIEnv* jniEnv, jobject /*this*/, jlong nativeRef)
{
    try {
        DJINNI_FUNCTION_PROLOGUE1(jniEnv, nativeRef);
        delete reinterpret_cast<::djinni::CppProxyHandle<::core::Core>*>(nativeRef);
    } JNI_TRANSLATE_EXCEPTIONS_RETURN(jniEnv, )
}

CJNIEXPORT jobject JNICALL Java_com_bitportal_core_Core_create(JNIEnv* jniEnv, jobject /*this*/)
{
    try {
        DJINNI_FUNCTION_PROLOGUE0(jniEnv);
        auto r = ::core::Core::create();
        return ::djinni::release(::djinni_generated::NativeCore::fromCpp(jniEnv, r));
    } JNI_TRANSLATE_EXCEPTIONS_RETURN(jniEnv, 0 /* value doesn't matter */)
}

CJNIEXPORT jstring JNICALL Java_com_bitportal_core_Core_00024CppProxy_native_1pbkdf2(JNIEnv* jniEnv, jobject /*this*/, jlong nativeRef, jstring j_password, jstring j_salt, jint j_iterations, jbyte j_keylen, jstring j_digest)
{
    try {
        DJINNI_FUNCTION_PROLOGUE1(jniEnv, nativeRef);
        const auto& ref = ::djinni::objectFromHandleAddress<::core::Core>(nativeRef);
        auto r = ref->pbkdf2(::djinni::String::toCpp(jniEnv, j_password),
                             ::djinni::String::toCpp(jniEnv, j_salt),
                             ::djinni::I32::toCpp(jniEnv, j_iterations),
                             ::djinni::I8::toCpp(jniEnv, j_keylen),
                             ::djinni::String::toCpp(jniEnv, j_digest));
        return ::djinni::release(::djinni::String::fromCpp(jniEnv, r));
    } JNI_TRANSLATE_EXCEPTIONS_RETURN(jniEnv, 0 /* value doesn't matter */)
}

}  // namespace djinni_generated