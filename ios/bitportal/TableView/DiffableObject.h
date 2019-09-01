#import <Foundation/Foundation.h>

#import <IGListKit/IGListKit.h>

#define genDiffableObject(k, v) [[DiffableObject alloc] initWithKey:k value:v]

@interface DiffableObject : NSObject <IGListDiffable, NSCopying>

- (instancetype)initWithKey:(id <NSCopying>)key value:(id)value;

@property (nonatomic, strong, readonly) id key;
@property (nonatomic, strong) id value;

@end
