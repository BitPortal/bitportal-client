//
//  TGAddressBarManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/9/5.
//  Copyright © 2019 Facebook. All rights reserved.
//
// #import "bitportal-Swift.h"
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(TGAddressBar, TGAddressBarManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(value, NSString)
RCT_EXPORT_VIEW_PROPERTY(cancelButtonText, NSString)
RCT_EXPORT_VIEW_PROPERTY(chain, NSString)
RCT_EXPORT_VIEW_PROPERTY(isSecure, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onLeftButtonClicked, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRightButtonClicked, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSubmit, RCTBubblingEventBlock)
@end
