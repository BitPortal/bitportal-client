//
//  CoreManager.m
//  bitportal
//
//  Created by Terence Ge on 2018/6/6.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "BPCoreModule.h"
#import <React/RCTLog.h>
#import "BPCore.h"

@implementation BPCoreModule

BPCore *_cppApi = [BPCore create];

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(pbkdf2,
                 password: (NSString *) password
                 salt: (NSString *) salt
                 iterations: (NSInteger) iterations
                 keylen: (NSInteger) keylen
                 digest: (NSString *) digest
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([_cppApi pbkdf2:password salt:salt iterations:(int32_t)iterations keylen:(int8_t)keylen digest:digest]);
};

 RCT_REMAP_METHOD(scrypt,
                  password: (NSString *) password
                  salt: (NSString *) salt
                  N: (NSInteger) N
                  r: (NSInteger) r
                  p: (NSInteger) p
                  dklen: (NSInteger) dklen
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
 {
   resolve([_cppApi scrypt:password salt:salt N:(int32_t)N r:(int8_t)r p:(int8_t)p dkLen:(int8_t)dklen]);
 };

RCT_REMAP_METHOD(scanHDBTCAddresses,
                 xpub: (NSString *) xpub
                 startIndex: (NSInteger) startIndex
                 endIndex: (NSInteger) endIndex
                 isSegWit: (BOOL) isSegWit
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([_cppApi scanHDBTCAddresses:xpub startIndex:startIndex endIndex:endIndex isSegWit:isSegWit]);
};
@end
