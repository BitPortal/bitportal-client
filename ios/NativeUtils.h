//
//  NativeUtils.h
//  bitportal
//
//  Created by apple on 2018/8/28.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import "SSKeychain.h"

#define KeyChainDeviceId @"KeychainDeviceId" // 手机keychain id
#define KeyChainService @"org.dexlize.bitportal" // apple id (com.dexlize.bitportal)


@interface NativeUtils : NSObject <RCTBridgeModule>

@end
