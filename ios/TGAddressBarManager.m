//
//  TGAddressBarManager.m
//  bitportal
//
//  Created by Terence Ge on 2019/9/5.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import "bitportal-Swift.h"
#import <React/RCTViewManager.h>

@interface TGAddressBarManager : RCTViewManager
@end

@implementation TGAddressBarManager

RCT_EXPORT_MODULE(TGAddressBar)

- (UIView *)view
{
  return [[AddressBar alloc] init];
}

@end
