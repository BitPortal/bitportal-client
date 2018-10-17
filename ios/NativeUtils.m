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

// 跳转系统设置界面
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
  if (appDelegate.registrationID) {
    callback(@[appDelegate.registrationID]);
  }
}
  
// 获取deviceID
RCT_EXPORT_METHOD(getDeviceID:(NSString *)jsString callback:(RCTResponseSenderBlock)callback) {
  NSString* deviceID = [self getDeviceId];
  callback(@[deviceID]);
}
  
// 获取设备唯一标识符
-(NSString *)getDeviceId {
  // 读取设备号
  NSString *localDeviceId = [SSKeychain passwordForService:KeyChainService account:KeyChainDeviceId];
  
  if (!localDeviceId) {
    // 保存设备号
    CFUUIDRef deviceId = CFUUIDCreate(NULL);
    assert(deviceId != NULL);
    CFStringRef deviceIdStr = CFUUIDCreateString(NULL, deviceId);
    [SSKeychain setPassword:[NSString stringWithFormat:@"%@", deviceIdStr] forService:KeyChainService account:KeyChainDeviceId];
    localDeviceId = [NSString stringWithFormat:@"%@", deviceIdStr];
  }
  return localDeviceId;
}

// 10.0 以上系统
-(BOOL)isNewSystem{
  double version = [UIDevice currentDevice].systemVersion.doubleValue;
  return version >= 10.0;
}

@end
