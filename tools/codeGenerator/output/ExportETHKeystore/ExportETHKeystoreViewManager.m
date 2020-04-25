//
//  ExportETHKeystoreViewManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(ExportETHKeystoreView, ExportETHKeystoreViewManager, RCTViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
