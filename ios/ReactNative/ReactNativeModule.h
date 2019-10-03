//
//  ReactNativeModule.h
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeDelegate.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReactNativeModule : NSObject<RCTBridgeDelegate> {
  void (^_onBundleLoaded)(void);
}

@property (nonatomic, copy) NSString *entryFile;
@property (nonatomic, copy, nullable) NSString *fallbackResource;
@property (nonatomic, copy) NSString *bundlePath;
@property (nonatomic) RCTBridge *bridge;

+(ReactNativeModule *)shared;

-(void)startReactNative;
-(void)startReactNative:(void(^)(void))onBundleLoaded;
-(void)startReactNative:(void(^)(void))onBundleLoaded launchOptions:(NSDictionary *)launchOptions;
@end

NS_ASSUME_NONNULL_END
