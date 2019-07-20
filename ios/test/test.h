//
//  test.hpp
//  bitportal
//
//  Created by Terence Ge on 2019/7/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#pragma once
#include <jsi/jsi.h>

namespace example {
    class Test {
    private:
        friend class TestBinding;
        int runTest() const;
    };
}
