//
//  NavBarManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/9/9.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(NavBar, NavBarManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(subTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(leftButtonTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(onLeftButtonClicked, RCTBubblingEventBlock)
@end
