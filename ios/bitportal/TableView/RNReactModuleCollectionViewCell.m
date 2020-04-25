//
//  RNReactModuleCollectionViewCell.m
//  RNTableView
//
//  Created by Terence Ge on 2018/11/7.
//  Copyright © 2018 Pavlo Aksonov. All rights reserved.
//

#import <React/RCTRootView.h>
#import <React/RCTConvert.h>
#import "RNReactModuleCollectionViewCell.h"
#import "RNTableView.h"

@implementation RNReactModuleCollectionViewCell {
    RCTRootView *_rootView;
    NSDictionary *_props;
}

-(NSDictionary*) toProps:(NSDictionary *)data indexPath:(NSIndexPath*)indexPath reactTag:(NSNumber*)reactTag {
    return @{@"data":data, @"section":[[NSNumber alloc] initWithLong:indexPath.section], @"row":[[NSNumber alloc] initWithLong:indexPath.row], @"tableViewReactTag":reactTag};
}

-(void)setUpAndConfigure:(NSDictionary*)data bridge:(RCTBridge*)bridge indexPath:(NSIndexPath*)indexPath reactModule:(NSString*)reactModule tableViewTag:(NSNumber*)reactTag {
    NSDictionary *props = [self toProps:data indexPath:indexPath reactTag:reactTag];
  
    if (_rootView == nil) {
        //Create the mini react app that will populate our cell. This will be called from cellForRowAtIndexPath
        _rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:reactModule initialProperties:props];
        [self.contentView addSubview:_rootView];
        _rootView.frame = self.contentView.frame;
        _rootView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
      _rootView.backgroundColor = [UIColor clearColor];
      
      if (data[@"moreButtonImage"] && [data[@"accessoryType"] intValue] == 1) {
        UIImage *moreButtonImage;
        if ([data[@"moreButtonImage"] isKindOfClass:[NSString class]])
        {
          moreButtonImage = [UIImage imageNamed:data[@"moreButtonImage"]];
        } else {
          moreButtonImage = [RCTConvert UIImage:data[@"moreButtonImage"]];
        }
        
        UIButton *moreButton = [UIButton new];
        [moreButton setImage:moreButtonImage forState:UIControlStateNormal];
        moreButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentFill;
        moreButton.contentVerticalAlignment   = UIControlContentVerticalAlignmentFill;
        moreButton.imageEdgeInsets = UIEdgeInsetsMake(12, 12, 12, 12);
        [moreButton addTarget:self action:@selector(moreButtonClick) forControlEvents:UIControlEventTouchUpInside];
        [_rootView addSubview:moreButton];
        moreButton.frame = CGRectMake(_rootView.frame.size.width - 52, 14.5, 52, 52);
      }
    } else {
        //Ask react to re-render us with new data
        _rootView.appProperties = props;
    }
    //The application will be unmounted in javascript when the cell/rootview is destroyed
}

-(void)moreButtonClick
{
  self.onMoreAccessoryPress(self.data);
}

-(void)prepareForReuse {
    [super prepareForReuse];
    //TODO prevent stale data flickering
}

@end
