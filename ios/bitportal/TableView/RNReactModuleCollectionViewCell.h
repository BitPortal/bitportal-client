//
//  RNReactModuleCollectionViewCell.h
//  RNTableView
//
//  Created by Terence Ge on 2018/11/7.
//  Copyright © 2018 Pavlo Aksonov. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNReactModuleCollectionViewCell : UICollectionViewCell {}

-(void)setUpAndConfigure:(NSDictionary*)data bridge:(RCTBridge*)bridge indexPath:(NSIndexPath*)indexPath reactModule:(NSString*)reactModule tableViewTag:(NSNumber*)reactTag;
@property(nonatomic, copy) RCTBubblingEventBlock onMoreAccessoryPress;
@property (strong, nonatomic) NSMutableDictionary *data;

@end

NS_ASSUME_NONNULL_END
