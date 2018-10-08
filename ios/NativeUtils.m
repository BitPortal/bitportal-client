//
//  NativeUtils.m
//  bitportal
//
//  Created by apple on 2018/8/28.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "NativeUtils.h"
#import "AppDelegate.h"

@implementation NativeUtils

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

//跳转系统设置界面
RCT_EXPORT_METHOD(goSettingPermission)
{
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

// 获取registrationID
RCT_EXPORT_METHOD(getRegistrationID:(NSString *)jsString callback:(RCTResponseSenderBlock)callback) {
  AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  NSLog(@"###--- %@", appDelegate.registrationID);
  if (appDelegate.registrationID) {
    callback(@[appDelegate.registrationID]);
  }
}

-(BOOL)isNewSystem{
  double version = [UIDevice currentDevice].systemVersion.doubleValue;
  return version >= 10.0;
}

@end
