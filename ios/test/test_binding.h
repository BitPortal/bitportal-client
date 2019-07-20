//
//  test_binding.hpp
//  bitportal
//
//  Created by Terence Ge on 2019/7/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#pragma once
#include "test.h"
#include <jsi/jsi.h>

using namespace facebook;

namespace example {
    class TestBinding : public jsi::HostObject {
    public:
        static void install(jsi::Runtime &runtime, std::shared_ptr<TestBinding> testBinding);
        TestBinding(std::unique_ptr<Test> test);

      jsi::Value get(jsi::Runtime &runtime, const jsi::PropNameID &name) override;

    private:
        std::unique_ptr<Test> test_;
    };
}
