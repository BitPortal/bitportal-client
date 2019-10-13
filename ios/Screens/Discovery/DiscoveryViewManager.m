//
//  DiscoveryViewManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(DiscoveryView, DiscoveryViewManager, RCTViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_VIEW_PROPERTY(data, NSArray)
@end
