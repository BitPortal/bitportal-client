//
//  SVGUse.h
//  SVGReact
//
//  Created by Pavlo Aksonov on 07.08.15.
//  Copyright (c) 2015 Pavlo Aksonov. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@class RCTBridge;

@protocol RNTableViewDatasource <NSObject>

// create method with params dictionary
- (id)initWithDictionary:(NSDictionary *)params;

// array of NSDictionary objects (sections) passed to RCTTableViewDatasource (each section should contain "items" value as NSArray of inner items (NSDictionary)
- (NSArray *)sections;

@end

@interface RNTableView : UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

@property(nonatomic, copy) NSMutableArray *oldSections;
@property(nonatomic, copy) NSMutableArray *sections;
@property(nonatomic, copy) NSArray *additionalItems;
@property(nonatomic, strong) NSString *json;
@property(nonatomic, strong) NSString *filter;
@property(nonatomic, strong) NSArray *filterArgs;
@property(nonatomic, strong) id selectedValue;
@property(nonatomic) float cellHeight;
@property(nonatomic) float footerHeight;
@property(nonatomic) float headerHeight;
@property(nonatomic) NSString* headerButtonText;
@property(nonatomic) NSString* headerButtonIcon;
@property(nonatomic) BOOL customCells;
@property(nonatomic) BOOL editing;
@property(nonatomic) BOOL moveWithinSectionOnly;
@property(nonatomic, assign) UIEdgeInsets contentInset;
@property(nonatomic, assign) CGPoint contentOffset;
@property(nonatomic, assign) UIEdgeInsets scrollIndicatorInsets;
@property(nonatomic, assign) BOOL showsHorizontalScrollIndicator;
@property(nonatomic, assign) BOOL showsVerticalScrollIndicator;
@property(nonatomic, assign) UIEdgeInsets cellSeparatorInset;
@property(nonatomic, assign) BOOL hasCellSeparatorInset;
@property(nonatomic, assign) UIEdgeInsets cellLayoutMargins;
@property(nonatomic, assign) BOOL hasCellLayoutMargins;
@property(nonatomic, assign) BOOL canRefresh;
@property(nonatomic, assign) BOOL refreshing;
@property(nonatomic, assign) BOOL canLoadMore;

@property(nonatomic, assign) UITableViewStyle tableViewStyle;
@property(nonatomic, assign) UITableViewCellStyle tableViewCellStyle;
@property(nonatomic, assign) UITableViewCellEditingStyle tableViewCellEditingStyle;
@property(nonatomic, assign) UITableViewCellSeparatorStyle separatorStyle;
@property(nonatomic, assign) UITableViewCellAccessoryType accessoryType;
@property(nonatomic, assign) UITableViewCellAccessoryType selectedAccessoryType;
@property(nonatomic, strong) UIFont *font;
@property(nonatomic, strong) UIFont *detailFont;
@property(nonatomic, strong) UIFont *headerFont;
@property(nonatomic, strong) UIColor *headerTextColor;
@property(nonatomic, strong) UIColor *headerBackgroundColor;
@property(nonatomic, strong) UIFont *footerFont;
@property(nonatomic, strong) UIColor *footerTextColor;

@property(nonatomic, strong) UIColor *textColor;
@property(nonatomic, strong) UIColor *tintColor;
@property(nonatomic, strong) UIColor *selectedTextColor;
@property(nonatomic, strong) UIColor *selectedBackgroundColor;
@property(nonatomic, strong) UIColor *detailTextColor;
@property(nonatomic, strong) UIColor *separatorColor;
@property(nonatomic) BOOL autoFocus;
@property(nonatomic) BOOL autoFocusAnimate;
@property(nonatomic) BOOL allowsToggle;
@property(nonatomic) BOOL switchOn;
@property(nonatomic) BOOL allowsMultipleSelection;
@property(nonatomic) BOOL alwaysBounceVertical;
@property(nonatomic) NSString *reactModuleForCell;

@property(nonatomic, assign) BOOL scrollEnabled;
@property(nonatomic, assign) BOOL sectionIndexTitlesEnabled;

@property(nonatomic, copy) RCTBubblingEventBlock onWillDisplayCell;
@property(nonatomic, copy) RCTBubblingEventBlock onEndDisplayingCell;
@property(nonatomic, copy) RCTBubblingEventBlock onPress;
@property(nonatomic, copy) RCTBubblingEventBlock onAccessoryPress;
@property(nonatomic, copy) RCTBubblingEventBlock onSwitchAccessoryChanged;
@property(nonatomic, copy) RCTBubblingEventBlock onAddAccessoryPress;
@property(nonatomic, copy) RCTBubblingEventBlock onItemNotification;
@property(nonatomic, copy) RCTBubblingEventBlock onChange;
@property(nonatomic, copy) RCTBubblingEventBlock onLeadingSwipe;
@property(nonatomic, copy) RCTBubblingEventBlock onTrailingSwipe;
@property(nonatomic, copy) RCTDirectEventBlock onScroll;
@property(nonatomic, copy) RCTDirectEventBlock onLoadMore;
@property(nonatomic, copy) RCTDirectEventBlock onRefresh;
@property(nonatomic, copy) RCTBubblingEventBlock onScrollViewDidEndDecelerating;
@property(nonatomic, copy) RCTBubblingEventBlock onCollectionViewDidSelectItem;
@property(nonatomic, copy) RCTBubblingEventBlock onMoreAccessoryPress;

- (void)addRefresh;
- (void)stopRefreshing;
- (void)startRefreshing;
- (void)sendNotification:(NSDictionary *)data;
- (void)scrollToOffsetX:(CGFloat)x offsetY:(CGFloat)y animated:(BOOL)animated;
- (void)scrollToIndex:(NSInteger)index section:(NSInteger)section animated:(BOOL)animated;
- (void)scrollCollectonViewToItem:(NSInteger)itemIndex index:(NSInteger)index section:(NSInteger)section animated:(BOOL)animated;

- (void)batchUpdates;
@end
