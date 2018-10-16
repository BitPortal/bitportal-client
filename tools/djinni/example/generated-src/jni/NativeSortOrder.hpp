// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from example.djinni

#pragma once

#include "djinni_support.hpp"
#include "sort_order.hpp"

namespace djinni_generated {

class NativeSortOrder final : ::djinni::JniEnum {
public:
    using CppType = ::textsort::sort_order;
    using JniType = jobject;

    using Boxed = NativeSortOrder;

    static CppType toCpp(JNIEnv* jniEnv, JniType j) { return static_cast<CppType>(::djinni::JniClass<NativeSortOrder>::get().ordinal(jniEnv, j)); }
    static ::djinni::LocalRef<JniType> fromCpp(JNIEnv* jniEnv, CppType c) { return ::djinni::JniClass<NativeSortOrder>::get().create(jniEnv, static_cast<jint>(c)); }

private:
    NativeSortOrder() : JniEnum("com/dropbox/textsort/SortOrder") {}
    friend ::djinni::JniClass<NativeSortOrder>;
};

}  // namespace djinni_generated
