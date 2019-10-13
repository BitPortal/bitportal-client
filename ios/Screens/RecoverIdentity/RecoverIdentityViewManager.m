//
//  RecoverIdentityViewManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(RecoverIdentityView, RecoverIdentityViewManager, RCTViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXTERN_METHOD(submitFailed:(nonnull NSString *)message)
RCT_EXTERN_METHOD(submitSucceeded)

RCT_EXPORT_VIEW_PROPERTY(onSubmit, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(loading, BOOL)
@end
