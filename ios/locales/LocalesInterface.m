//
//  LocalesInterface.m
//  BminingApp
//
//  Created by binkerC on 2020/6/15.
//

#import "LocalesInterface.h"

@implementation LocalesInterface


RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(getSystemLocales:(RCTResponseSenderBlock)callback){
  
  NSArray * preferredLanguages = [NSLocale preferredLanguages];
  NSString * language = preferredLanguages.firstObject;
  NSString * languageCode = @"en";
  if ([language containsString:@"zh"]) {
    languageCode = @"zh_CN";
  }else if ([language containsString:@"en"]) {
    languageCode = @"en";
  }else if ([language containsString:@"ko"]) {
       languageCode = @"ko";
  }
  
    if (callback) callback(@[languageCode]);
};
@end
