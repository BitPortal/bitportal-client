#import "DiffableObject.h"

@implementation DiffableObject

- (instancetype)initWithKey:(id)key value:(id)value {
    if (self = [super init]) {
        _key = [key copy];
        _value = value;
    }
    return self;
}

- (instancetype)copyWithZone:(NSZone *)zone {
    return [[DiffableObject alloc] initWithKey:self.key value:self.value];
}


#pragma mark - IGListDiffable

- (id<NSObject>)diffIdentifier {
    return self.key;
}

- (BOOL)isEqualToDiffableObject:(id)object {
    if (object == self) {
        return YES;
    }
    if ([object isKindOfClass:[DiffableObject class]]) {
        id k1 = self.key;
        id k2 = [object key];
        id v1 = self.value;
        id v2 = [(DiffableObject *)object value];
        if ([v1 isKindOfClass:[NSDictionary class]]) {
            return (v1 == v2 || [v1 isEqualToDictionary:v2]) && (k1 == k2 || [k1 isEqual:k2]);
        } else {
            return (v1 == v2 || [v1 isEqual:v2]) && (k1 == k2 || [k1 isEqual:k2]);
        }
    }
    return NO;
}

@end
