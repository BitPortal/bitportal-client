// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from extended_record.djinni

#import "DBExtendedRecord.h"
#import "DBRecordUsingExtendedRecord.h"
#import <Foundation/Foundation.h>

@interface DBRecordUsingExtendedRecord : NSObject
- (nonnull instancetype)initWithEr:(nonnull DBExtendedRecord *)er;
+ (nonnull instancetype)recordUsingExtendedRecordWithEr:(nonnull DBExtendedRecord *)er;

+ (DBRecordUsingExtendedRecord * __nonnull)cr;
@property (nonatomic, readonly, nonnull) DBExtendedRecord * er;

@end

