// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from primitive_list.djinni

#import "DBPrimitiveList.h"
#include "primitive_list.hpp"

static_assert(__has_feature(objc_arc), "Djinni requires ARC to be enabled for this file");

@class DBPrimitiveList;

namespace djinni_generated {

struct PrimitiveList
{
    using CppType = ::testsuite::PrimitiveList;
    using ObjcType = DBPrimitiveList*;

    using Boxed = PrimitiveList;

    static CppType toCpp(ObjcType objc);
    static ObjcType fromCpp(const CppType& cpp);
};

}  // namespace djinni_generated
