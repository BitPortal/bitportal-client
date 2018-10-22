// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from extended_record.djinni

#include "NativeRecordUsingExtendedRecord.hpp"  // my header
#include "NativeExtendedRecord.hpp"

namespace djinni_generated {

NativeRecordUsingExtendedRecord::NativeRecordUsingExtendedRecord() = default;

NativeRecordUsingExtendedRecord::~NativeRecordUsingExtendedRecord() = default;

auto NativeRecordUsingExtendedRecord::fromCpp(JNIEnv* jniEnv, const CppType& c) -> ::djinni::LocalRef<JniType> {
    const auto& data = ::djinni::JniClass<NativeRecordUsingExtendedRecord>::get();
    auto r = ::djinni::LocalRef<JniType>{jniEnv->NewObject(data.clazz.get(), data.jconstructor,
                                                           ::djinni::get(::djinni_generated::NativeExtendedRecord::fromCpp(jniEnv, c.er)))};
    ::djinni::jniExceptionCheck(jniEnv);
    return r;
}

auto NativeRecordUsingExtendedRecord::toCpp(JNIEnv* jniEnv, JniType j) -> CppType {
    ::djinni::JniLocalScope jscope(jniEnv, 2);
    assert(j != nullptr);
    const auto& data = ::djinni::JniClass<NativeRecordUsingExtendedRecord>::get();
    return {::djinni_generated::NativeExtendedRecord::toCpp(jniEnv, jniEnv->GetObjectField(j, data.field_mEr))};
}

}  // namespace djinni_generated
