/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "BitPortal-Swift.h"
#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBridge+Private.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "ReactNativeNavigation.h"
#import "SplashScreen.h"
#import "RNUMConfigure.h"
#import "UMAnalyticsModule.h"
#import <UMAnalytics/MobClick.h>

@interface AppDelegate ()<JPUSHRegisterDelegate>
@end

@implementation AppDelegate

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  // 注册 DeviceToken
  [JPUSHService registerDeviceToken:deviceToken];

  // 获取 registrationID
  [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
    NSLog(@"resCode : %d,registrationID: %@",resCode,registrationID);
    _registrationID = registrationID;
  }];

}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"kJPFDidReceiveRemoteNotification" object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"kJPFDidReceiveRemoteNotification" object: notification.userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"kJPFDidReceiveRemoteNotification" object:userInfo];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler
{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"kJPFDidReceiveRemoteNotification" object:userInfo];
  }

  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"kJPFOpenNotification" object:userInfo];
  }

  completionHandler();
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // JPush
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    // 可以添加自定义categories
    // NSSet<UNNotificationCategory *> *categories for iOS10 or later
    // NSSet<UIUserNotificationCategory *> *categories for iOS8 and iOS9
  }
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  [JPUSHService setupWithOption:launchOptions appKey:@"05e8b10824ab700bae78e9eb"
                        channel:@"app store" apsForProduction:false];

  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  // Umeng sdk:
  [UMConfigure setLogEnabled:NO];
  [RNUMConfigure initWithAppkey:@"5b46cc71f43e481b4f0000e7" channel:@"App Store"];
  [MobClick setScenarioType:E_UM_NORMAL];
  // splash:
  [SplashScreen show];
  return YES;
}

//- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
//{
//  self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
//  UIViewController *vc = [TableViewController new];
//  UINavigationController *nvc = [[UINavigationController alloc] initWithRootViewController:vc];
//  if (@available(iOS 11.0, *)) {
//    nvc.navigationBar.prefersLargeTitles = YES;
//  }
//
//  self.window.rootViewController = nvc;
//  [self.window makeKeyAndVisible];
//
//  return YES;
//}

- (void)application:(UIApplication *)application didChangeStatusBarFrame:(CGRect)oldStatusBarFrame {

}
@end
