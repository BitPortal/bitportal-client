// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from core.djinni

#import "BPCore+Private.h"
#import "BPCore.h"
#import "DJICppWrapperCache+Private.h"
#import "DJIError.h"
#import "DJIMarshal+Private.h"
#include <exception>
#include <stdexcept>
#include <utility>

static_assert(__has_feature(objc_arc), "Djinni requires ARC to be enabled for this file");

@interface BPCore ()

- (id)initWithCpp:(const std::shared_ptr<::core::Core>&)cppRef;

@end

@implementation BPCore {
    ::djinni::CppProxyCache::Handle<std::shared_ptr<::core::Core>> _cppRefHandle;
}

- (id)initWithCpp:(const std::shared_ptr<::core::Core>&)cppRef
{
    if (self = [super init]) {
        _cppRefHandle.assign(cppRef);
    }
    return self;
}

+ (nullable BPCore *)create {
    try {
        auto objcpp_result_ = ::core::Core::create();
        return ::djinni_generated::Core::fromCpp(objcpp_result_);
    } DJINNI_TRANSLATE_EXCEPTIONS()
}

- (nonnull NSString *)pbkdf2:(nonnull NSString *)password
                        salt:(nonnull NSString *)salt
                  iterations:(int32_t)iterations
                      keylen:(int8_t)keylen
                      digest:(nonnull NSString *)digest {
    try {
        auto objcpp_result_ = _cppRefHandle.get()->pbkdf2(::djinni::String::toCpp(password),
                                                          ::djinni::String::toCpp(salt),
                                                          ::djinni::I32::toCpp(iterations),
                                                          ::djinni::I8::toCpp(keylen),
                                                          ::djinni::String::toCpp(digest));
        return ::djinni::String::fromCpp(objcpp_result_);
    } DJINNI_TRANSLATE_EXCEPTIONS()
}

namespace djinni_generated {

auto Core::toCpp(ObjcType objc) -> CppType
{
    if (!objc) {
        return nullptr;
    }
    return objc->_cppRefHandle.get();
}

auto Core::fromCppOpt(const CppOptType& cpp) -> ObjcType
{
    if (!cpp) {
        return nil;
    }
    return ::djinni::get_cpp_proxy<BPCore>(cpp);
}

}  // namespace djinni_generated

@end