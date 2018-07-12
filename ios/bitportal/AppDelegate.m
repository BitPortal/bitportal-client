/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeNavigation.h>
#import "SplashScreen.h"
#import "RNUMConfigure.h"
#import "UMAnalyticsModule.h"
#import <UMAnalytics/MobClick.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  
  // Umeng sdk:
  if (DEBUG) {
    [UMConfigure setLogEnabled:YES];
  }
  [RNUMConfigure initWithAppkey:@"5b46cc71f43e481b4f0000e7" channel:@"App Store"];
  [MobClick setScenarioType:E_UM_NORMAL];
  
  // splash:
  [SplashScreen show];
  return YES;
}

@end
