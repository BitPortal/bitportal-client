//
//  NativeUtils.m
//  bitportal
//
//  Created by apple on 2018/8/28.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "NativeUtils.h"

@implementation NativeUtils

RCT_EXPORT_MODULE();

//跳转系统设置界面
RCT_EXPORT_METHOD(goSettingPermission)
{
  //  RCTLogInfo(@"type: %@", name);
  NSURL *settingUrl = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
  if ([self isNewSystem]) { // 10.0 以上系统
    [[UIApplication sharedApplication] openURL:settingUrl options:@{} completionHandler:^(BOOL success) {
    }];
  }else{
    BOOL res = [[UIApplication sharedApplication] canOpenURL:settingUrl];
    if (res) {
      [[UIApplication sharedApplication] openURL:settingUrl];
      exit(0);
    }
  }
}

-(BOOL)isNewSystem{
  double version = [UIDevice currentDevice].systemVersion.doubleValue;
  return version >= 10.0;
}

@end
