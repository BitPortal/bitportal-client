//
//  ReactNativeViewController.m
//  bitportal
//
//  Created by Terence Ge on 2019/10/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#import "ReactNativeViewController.h"
#import "ReactNativeModule.h"

@interface ReactNativeViewController ()

@end

@implementation ReactNativeViewController

@synthesize moduleName = _moduleName;
@synthesize initialProperties = _initialProperties;

-(instancetype)initWithModuleName:(NSString *)moduleName {
  return [self initWithModuleName:moduleName andInitialProperties:nil];
}

-(instancetype)initWithModuleName:(NSString *)moduleName
             andInitialProperties:(NSDictionary*)initialProperties {
  self = [super init];
  _moduleName = moduleName;
  _initialProperties = initialProperties;
  
  RCTBridge *bridge = [[ReactNativeModule shared] bridge];
  if (bridge == nil) {
    NSLog(@"Error: You need to start React Native in order to use ReactNativeViewController, make sure to run [[BridgeManager shared] startReactNative] before instantiating it.");
    return nil;
  }
  
  if (_moduleName) {
    RCTRootView *reactView = [[RCTRootView alloc] initWithBridge:bridge moduleName:_moduleName initialProperties:_initialProperties];
    self.view = reactView;
  }
  
  return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
