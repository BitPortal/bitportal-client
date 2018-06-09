// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from core.djinni

#include "core.hpp"
#include <memory>

static_assert(__has_feature(objc_arc), "Djinni requires ARC to be enabled for this file");

@class BPCore;

namespace djinni_generated {

class Core
{
public:
    using CppType = std::shared_ptr<::core::Core>;
    using CppOptType = std::shared_ptr<::core::Core>;
    using ObjcType = BPCore*;

    using Boxed = Core;

    static CppType toCpp(ObjcType objc);
    static ObjcType fromCppOpt(const CppOptType& cpp);
    static ObjcType fromCpp(const CppType& cpp) { return fromCppOpt(cpp); }

private:
    class ObjcProxy;
};

}  // namespace djinni_generated

