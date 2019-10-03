const swiftViewTemplate = (name) => `//
//  ${name}View.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

class ${name}View: UIView {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

}
`

const swiftViewManagerTemplate = (name) => `//
//  ${name}ViewManager.swift
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit

@objc(${name}ViewManager)
class ${name}ViewManager: RCTViewManager {
  @objc override func view() -> UIView! {
    return ${name}View.init()
  }
}
`

const objcViewManagerTemplate = (name) => `//
//  ${name}ViewManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(${name}View, ${name}ViewManager, RCTViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
`
const jsViewTemplate = (name) => `import { requireNativeComponent } from 'react-native'
const ${name}View = requireNativeComponent('${name}View')
export default ${name}View
`

module.exports = {
  swiftViewTemplate,
  swiftViewManagerTemplate,
  objcViewManagerTemplate,
  jsViewTemplate
}
