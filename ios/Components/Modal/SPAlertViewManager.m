//
//  SPAlertViewManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/8/29.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(SPAlert, SPAlertViewManager, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXTERN_METHOD(presentDone:(nonnull NSString *)title)
RCT_EXTERN_METHOD(presentHeart:(nonnull NSString *)title)
RCT_EXTERN_METHOD(presentTitle:(nonnull NSString *)title)
RCT_EXTERN_METHOD(presentMessage:(nonnull NSString *)title)

@end
