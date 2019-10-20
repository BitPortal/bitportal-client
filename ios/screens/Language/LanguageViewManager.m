//
//  LanguageViewManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/10/2.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(LanguageView, LanguageViewManager, RCTViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_VIEW_PROPERTY(data, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onLocaleSelected, RCTBubblingEventBlock)
@end
