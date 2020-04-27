//
//  SVGUse.m
//  SVGReact
//
//  Created by Pavlo Aksonov on 07.08.15.
//  Copyright (c) 2015 Pavlo Aksonov. All rights reserved.
//
#import "bitportal-Swift.h"
#import "RNTableView.h"
#import "RNTableViewCellWithCollectionViewInside.h"
#import "SnappingCollectionViewLayout.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>
#import "JSONDataSource.h"
#import "RNCellView.h"
#import "RNTableFooterView.h"
#import "RNTableHeaderView.h"
#import "RNReactModuleCell.h"
#import "RNReactModuleCollectionViewCell.h"
#import "DiffableObject.h"
#import <IGListKit/IGListKit.h>

@interface RNTableView()<UITableViewDataSource, UITableViewDelegate, UICollectionViewDelegateFlowLayout> {
    id<RNTableViewDatasource> datasource;
}
@property (strong, nonatomic) NSMutableArray *selectedIndexes;
@property (strong, nonatomic) UITableView *tableView;
@property (nonatomic, strong) UIRefreshControl *refreshControl;

@end

@implementation RNTableView {
    RCTBridge *_bridge;
    RCTEventDispatcher *_eventDispatcher;
    NSArray *_items;
    NSMutableArray *_cells;
    NSString *_reactModuleCellReuseIndentifier;
    NSString *_collectionViewInsideTableViewCell;
    NSMutableDictionary *_lastValue;
}

- (void)setEditing:(BOOL)editing {
    _editing = editing;

    [self.tableView setEditing:editing animated:YES];
}

- (void)setSeparatorColor:(UIColor *)separatorColor {
    _separatorColor = separatorColor;
    
    [self.tableView setSeparatorColor: separatorColor];
}

- (void)setScrollEnabled:(BOOL)scrollEnabled {
    _scrollEnabled = scrollEnabled;
    
    [self.tableView setScrollEnabled:scrollEnabled];
}

- (void)setAlwaysBounceVertical:(BOOL)alwaysBounceVertical {
    _alwaysBounceVertical = alwaysBounceVertical;
    
    [self.tableView setAlwaysBounceVertical:alwaysBounceVertical];
}

-(void)setSectionIndexTitlesEnabled:(BOOL)sectionIndexTitlesEnabled
{
    _sectionIndexTitlesEnabled = sectionIndexTitlesEnabled;
}

-(void)setScrollToDismissEnabled:(BOOL)scrollToDismissEnabled
{
  _scrollToDismissEnabled = scrollToDismissEnabled;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    // will not insert because we don't need to draw them
    //   [super insertSubview:subview atIndex:atIndex];
    
    // just add them to registry
    if ([subview isKindOfClass:[RNCellView class]]){
        RNCellView *cellView = (RNCellView *)subview;
        cellView.tableView = self.tableView;
        while (cellView.section >= [_cells count]){
            [_cells addObject:[NSMutableArray array]];
        }
        [_cells[cellView.section] addObject:subview];
        if (cellView.section == [_sections count]-1 && cellView.row == [_sections[cellView.section][@"count"] integerValue]-1){
            [self.tableView reloadData];
        }
    } else if ([subview isKindOfClass:[RNTableFooterView class]]){
        RNTableFooterView *footerView = (RNTableFooterView *)subview;
        footerView.tableView = self.tableView;
    } else if ([subview isKindOfClass:[RNTableHeaderView class]]){
        RNTableHeaderView *headerView = (RNTableHeaderView *)subview;
        headerView.tableView = self.tableView;
    }
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    RCTAssertParam(bridge);
    RCTAssertParam(bridge.eventDispatcher);
    
    if ((self = [super initWithFrame:CGRectZero])) {
        _eventDispatcher = bridge.eventDispatcher;
        
        _bridge = bridge;
        while ([_bridge respondsToSelector:NSSelectorFromString(@"parentBridge")]
               && [_bridge valueForKey:@"parentBridge"]) {
            _bridge = [_bridge valueForKey:@"parentBridge"];
        }
        
        _cellHeight = 44;
        _cells = [NSMutableArray array];
        _autoFocus = YES;
        _autoFocusAnimate = YES;
        _allowsToggle = NO;
        _allowsMultipleSelection = NO;
    }
    return self;
}

RCT_NOT_IMPLEMENTED(-initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(-initWithCoder:(NSCoder *)aDecoder)
- (void)setTableViewStyle:(UITableViewStyle)tableViewStyle {
    _tableViewStyle = tableViewStyle;
    
    [self createTableView];
}

- (void)setSeparatorStyle:(UITableViewCellSeparatorStyle)separatorStyle {
    _separatorStyle = separatorStyle;
    
    [self.tableView setSeparatorStyle:separatorStyle];
}

- (void)setContentInset:(UIEdgeInsets)insets {
    _contentInset = insets;
    _tableView.contentInset = insets;
}

- (void)setContentOffset:(CGPoint)offset {
    _contentOffset = offset;
    _tableView.contentOffset = offset;
}

- (void)setScrollIndicatorInsets:(UIEdgeInsets)insets {
    _scrollIndicatorInsets = insets;
    _tableView.scrollIndicatorInsets = insets;
}

- (void)setShowsHorizontalScrollIndicator:(BOOL)showsHorizontalScrollIndicator {
    _showsHorizontalScrollIndicator = showsHorizontalScrollIndicator;
    [_tableView setShowsHorizontalScrollIndicator: showsHorizontalScrollIndicator];
}

- (void)setShowsVerticalScrollIndicator:(BOOL)showsVerticalScrollIndicator {
    _showsVerticalScrollIndicator = showsVerticalScrollIndicator;
    [_tableView setShowsVerticalScrollIndicator: showsVerticalScrollIndicator];
}

#pragma mark -

- (void)layoutSubviews {
    [self.tableView setFrame:self.frame];
    
    // if sections are not define, try to load JSON
    if (![_sections count] && _json){
        datasource = [[JSONDataSource alloc] initWithFilename:_json filter:_filter args:_filterArgs];
        self.sections = [NSMutableArray arrayWithArray:[datasource sections]];
    }
    
    // find first section with selection
    NSInteger selectedSection = -1;
    for (int i=0;i<[_selectedIndexes count];i++){
        if ([_selectedIndexes[i] intValue] != -1){
            selectedSection = i;
            break;
        }
    }
    // focus of first selected value
    if (_autoFocus && selectedSection>=0 && [self numberOfSectionsInTableView:self.tableView] && [self tableView:self.tableView numberOfRowsInSection:selectedSection]){
        dispatch_async(dispatch_get_main_queue(), ^{
            NSIndexPath *indexPath = [NSIndexPath indexPathForItem:[_selectedIndexes[selectedSection] intValue ]inSection:selectedSection];
            if (!_allowsMultipleSelection) {
                _lastValue = [self dataForRow:indexPath.item section:indexPath.section];
            }
            [self.tableView scrollToRowAtIndexPath:indexPath atScrollPosition:UITableViewScrollPositionMiddle animated:_autoFocusAnimate];
        });
    }
}

- (NSArray *)sectionIndexTitlesForTableView:(UITableView *)tableView {
    // create selected indexes
    NSMutableArray *keys = [NSMutableArray arrayWithCapacity:[_sections count]];
    
    if (_sectionIndexTitlesEnabled) {
        for (NSDictionary *section in _sections){
            NSString *label = section[@"label"] ?: @"";
            [keys addObject:label];
        }
    }
    
    return keys;
}

#pragma mark - Public APIs

- (void) scrollToOffsetX:(CGFloat)x offsetY:(CGFloat)y animated:(BOOL)animated {
    [_tableView setContentOffset:CGPointMake(x, y) animated:animated];
}

#pragma mark - Private APIs

- (void)createTableView {
  UIColor *tablewViewBackgroundColor = [UIColor clearColor];
  if (@available(iOS 13, *)) {
    if (_tableViewStyle == UITableViewStyleGrouped) {
      tablewViewBackgroundColor = [UIColor systemGroupedBackgroundColor];
    } else {
      tablewViewBackgroundColor = [UIColor systemBackgroundColor];
    }
  }
  
    _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:_tableViewStyle];
    _tableView.backgroundColor = tablewViewBackgroundColor;
    _tableView.dataSource = self;
    _tableView.delegate = self;
    _tableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];
    _tableView.allowsMultipleSelectionDuringEditing = NO;
    _tableView.contentInset = self.contentInset;
    _tableView.contentOffset = self.contentOffset;
    _tableView.scrollIndicatorInsets = self.scrollIndicatorInsets;
    _tableView.showsHorizontalScrollIndicator = self.showsHorizontalScrollIndicator;
    _tableView.showsVerticalScrollIndicator = self.showsVerticalScrollIndicator;
    // _tableView.backgroundColor = [UIColor clearColor];
    _tableView.alwaysBounceVertical = self.alwaysBounceVertical;
    UIView *view = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 0.001, 0.001)];
    _tableView.tableHeaderView = view;
    _tableView.tableFooterView = view;
    _tableView.separatorStyle = self.separatorStyle;
    _tableView.separatorColor = self.separatorColor;
    _tableView.scrollEnabled = self.scrollEnabled;
    _tableView.editing = self.editing;
    _reactModuleCellReuseIndentifier = @"ReactModuleCell";
    _collectionViewInsideTableViewCell = @"CollectionViewInsideTableViewCell";
    [_tableView registerClass:[RNReactModuleCell class] forCellReuseIdentifier:_reactModuleCellReuseIndentifier];
    _oldSections = [NSMutableArray array];
  
    [self addSubview:_tableView];
}

- (void)tableView:(UITableView *)tableView willDisplayFooterView:(nonnull UIView *)view forSection:(NSInteger)section {
    UITableViewHeaderFooterView *footer = (UITableViewHeaderFooterView *)view;
    
    if (self.footerTextColor){
        footer.textLabel.textColor = self.footerTextColor;
    }
    if (self.footerFont){
        footer.textLabel.font = self.footerFont;
    }
}

-(void)addRefresh  {
    self.tableView.refreshControl = [[UIRefreshControl alloc] init];
    
    [self.tableView.refreshControl addTarget:self action:@selector(onRefreshBegin:) forControlEvents:UIControlEventValueChanged];
}

-(void)onRefreshBegin:(UIRefreshControl *)sender{
    self.onRefresh(@{});
    
//    if(self.refreshing == NO) {
//        [self.tableView.refreshControl endRefreshing];
//        self.tableView.refreshControl.layer.zPosition -= 1;
//    }
}

-(void)startRefreshing {
    [self.tableView.refreshControl beginRefreshing];
}

-(void)stopRefreshing {
    [self.tableView.refreshControl endRefreshing];
}

-(void)scrollToIndex: (NSInteger)index section:(NSInteger)section animated:(BOOL)animated {
    if ([self.tableView numberOfRowsInSection:section] > index) {
        NSIndexPath *newIndexPath = [NSIndexPath indexPathForRow:index inSection:section];
        [self.tableView scrollToRowAtIndexPath:newIndexPath atScrollPosition:UITableViewScrollPositionTop animated:animated];
    }
}

-(void)scrollCollectonViewToItem: (NSInteger)itemIndex index:(NSInteger)index section:(NSInteger)section animated:(BOOL)animated {
    if ([self.tableView numberOfRowsInSection:section] > index) {
        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:index inSection:section];
        RNTableViewCellWithCollectionViewInside *cell = [self.tableView cellForRowAtIndexPath:indexPath];
        if ([cell isKindOfClass:[RNTableViewCellWithCollectionViewInside class]]) {
            [cell scrollToItem:itemIndex animated:animated];
        }
    }
}

-(void)sendNotification: (NSDictionary *)data {
    self.onItemNotification(data);
}

-(void)setHeaderHeight:(float)headerHeight {
    _headerHeight = headerHeight;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{
    if (_sections[section][@"headerHeight"]){
        return [_sections[section][@"headerHeight"] floatValue] ? [_sections[section][@"headerHeight"] floatValue] : 0.000001;
    } else {
        if (self.headerHeight){
            return self.headerHeight;
        }
        return -1;
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{
    if (_sections[section][@"footerHeight"]){
        return [_sections[section][@"footerHeight"] floatValue] ? [_sections[section][@"footerHeight"] floatValue] : 0.000001;
        
    } else {
        if (self.footerHeight){
            return self.footerHeight;
        }
        return -1;
    }
}

- (void)tableView:(UITableView *)tableView willDisplayHeaderView:(UIView *)view forSection:(NSInteger)section {
    UITableViewHeaderFooterView *header = (UITableViewHeaderFooterView *)view;
    
    if (self.headerTextColor){
        header.textLabel.textColor = self.headerTextColor;
    }
    if (self.headerFont){
        header.textLabel.font = self.headerFont;
    }

    if (self.headerBackgroundColor) {
        header.contentView.backgroundColor = self.headerBackgroundColor;
    }

    if (_sections[section][@"headerButtonText"] && [_sections[section][@"headerButtonText"] isKindOfClass:[NSString class]]) {
        // Remove old button from re-used header
        if ([header.subviews.lastObject isKindOfClass:UIButton.class]) {
          [header.subviews.lastObject removeFromSuperview];
        }
          
        // UIButton *headerButton = [UIButton buttonWithType:UIButtonTypeContactAdd];
        UIButton *headerButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        [headerButton setTitle:_sections[section][@"headerButtonText"] forState:UIControlStateNormal];
        [headerButton.titleLabel setFont:[UIFont systemFontOfSize: 15]];
        [headerButton sizeToFit];
        headerButton.tag = section;
        [headerButton addTarget:self action:@selector(headerButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [header addSubview:headerButton];

        // Place button on far right margin of header
        headerButton.translatesAutoresizingMaskIntoConstraints = NO; // use autolayout constraints instead
        [headerButton.trailingAnchor constraintEqualToAnchor:header.layoutMarginsGuide.trailingAnchor].active = YES;
        [headerButton.bottomAnchor constraintEqualToAnchor:header.layoutMarginsGuide.bottomAnchor].active = YES;
    } else if (_sections[section][@"headerButtonIcon"] && [_sections[section][@"headerButtonIcon"] isKindOfClass:[NSString class]]) {
        // Remove old button from re-used header
        if ([header.subviews.lastObject isKindOfClass:UIButton.class]) {
          [header.subviews.lastObject removeFromSuperview];
        }
          
        UIButton *headerButton = [UIButton buttonWithType:UIButtonTypeContactAdd];
        headerButton.tag = section;
        [headerButton addTarget:self action:@selector(headerButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [header addSubview:headerButton];

        // Place button on far right margin of header
        headerButton.translatesAutoresizingMaskIntoConstraints = NO; // use autolayout constraints instead
        [headerButton.trailingAnchor constraintEqualToAnchor:header.layoutMarginsGuide.trailingAnchor].active = YES;
        [headerButton.centerYAnchor constraintEqualToAnchor:header.layoutMarginsGuide.centerYAnchor].active = YES;
    }
}

- (void)headerButtonClicked:(id)sender {

}

-(void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (self.hasCellLayoutMargins && [cell respondsToSelector:@selector(setLayoutMargins:)] && [cell respondsToSelector:@selector(setPreservesSuperviewLayoutMargins:)]) {
        [cell setPreservesSuperviewLayoutMargins:NO];
        [cell setLayoutMargins:self.cellLayoutMargins];
    }
    if (self.hasCellSeparatorInset && [cell respondsToSelector:@selector(setSeparatorInset:)]) {
        [cell setSeparatorInset:self.cellSeparatorInset];
    }
    if (self.font){
        cell.detailTextLabel.font = self.font;
        cell.textLabel.font = self.font;
    }
    if (self.detailFont)
    {
        cell.detailTextLabel.font = self.detailFont;
    }
    if (self.tintColor){
        cell.tintColor = self.tintColor;
    }
    NSDictionary *item = [self dataForRow:indexPath.item section:indexPath.section];
    if (self.selectedTextColor && [item[@"selected"] intValue]){
        cell.textLabel.textColor = self.selectedTextColor;
        cell.detailTextLabel.textColor = self.selectedTextColor;
    } else {
        if (self.textColor){
            cell.textLabel.textColor = self.textColor;
            cell.detailTextLabel.textColor = self.textColor;
        }
        if (self.detailTextColor){
            cell.detailTextLabel.textColor = self.detailTextColor;
        }
        
    }
    
    if (self.selectedBackgroundColor && [item[@"selected"] intValue])
    {
        [cell setBackgroundColor:self.selectedBackgroundColor];
    } else {
        if (item[@"transparent"])
        {
            [cell setBackgroundColor:[UIColor clearColor]];
        } else {
            // [cell setBackgroundColor:[UIColor whiteColor]];
        }
    }
    
//    if (item[@"image"]) {
//        UIImage *image;
//        if ([item[@"image"] isKindOfClass:[NSString class]])
//        {
//            image = [UIImage imageNamed:item[@"image"]];
//        } else {
//            image = [RCTConvert UIImage:item[@"image"]];
//        }
//        if ([item[@"imageWidth"] intValue]) {
//            CGSize itemSize = CGSizeMake([item[@"imageWidth"] intValue], image.size.height);
//            CGPoint itemPoint = CGPointMake((itemSize.width - image.size.width) / 2, (itemSize.height - image.size.height) / 2);
//            UIGraphicsBeginImageContextWithOptions(itemSize, NO, UIScreen.mainScreen.scale);
//            [image drawAtPoint:itemPoint];
//            cell.imageView.image = UIGraphicsGetImageFromCurrentImageContext();
//            UIGraphicsEndImageContext();
//        } else {
//            cell.imageView.image = image;
//        }
//    }
  
    self.onWillDisplayCell(@{@"target":self.reactTag, @"row":@(indexPath.row), @"section": @(indexPath.section)});
}

- (void)tableView:(UITableView *)tableView didEndDisplayingCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    self.onEndDisplayingCell(@{@"target":self.reactTag, @"row":@(indexPath.row), @"section": @(indexPath.section)});
}

- (void)setSections:(NSArray *)sections
{
    _oldSections = _sections;
    _sections = [NSMutableArray arrayWithCapacity:[sections count]];
    
    // create selected indexes
    _selectedIndexes = [NSMutableArray arrayWithCapacity:[sections count]];
    
    BOOL found = NO;
    for (NSDictionary *section in sections){
        NSMutableDictionary *sectionData = [NSMutableDictionary dictionaryWithDictionary:section];
        NSMutableArray *allItems = [NSMutableArray array];
        if (self.additionalItems){
            [allItems addObjectsFromArray:self.additionalItems];
        }
        [allItems addObjectsFromArray:sectionData[@"items"]];
        
        NSMutableArray *items = [NSMutableArray arrayWithCapacity:[allItems count]];
        NSInteger selectedIndex = -1;
        for (NSDictionary *item in allItems){
            NSMutableDictionary *itemData = [NSMutableDictionary dictionaryWithDictionary:item];
            if ((itemData[@"selected"] && [itemData[@"selected"] intValue]) || (self.selectedValue && [self.selectedValue isEqual:item[@"value"]])){
                if(selectedIndex == -1)
                    selectedIndex = [items count];
                itemData[@"selected"] = @YES;
                found = YES;
            }
            [items addObject:itemData];
        }
        [_selectedIndexes addObject:[NSNumber numberWithUnsignedInteger:selectedIndex]];
        
        sectionData[@"items"] = items;
        [_sections addObject:sectionData];
    }
    [self.tableView reloadData];
    // [self batchUpdates];
}

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return [_sections count];
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    NSInteger count = [_sections[section][@"items"] count];
    // if we have custom cells, additional processing is necessary
    if ([self hasCustomCells:section]){
        if ([_cells count]<=section){
            return 0;
        }
        // don't display cells until their's height is not calculated (TODO: maybe it is possible to optimize??)
        for (RNCellView *view in _cells[section]){
            if (!view.componentHeight){
                return 0;
            }
        }
        count = [_cells[section] count];
    }
    return count;
}



-(UITableViewCell*)setupReactModuleCell:(UITableView *)tableView data:(NSDictionary*)data indexPath:(NSIndexPath *)indexPath reactModuleForCell:(NSString *)reactModuleForCell {
    RCTAssert(_bridge, @"Must set global bridge in AppDelegate, e.g. \n\
              #import <RNTableView/RNAppGlobals.h>\n\
              [[RNAppGlobals sharedInstance] setAppBridge:rootView.bridge]");
    RNReactModuleCell *cell = [tableView dequeueReusableCellWithIdentifier:reactModuleForCell];
    if (cell == nil) {
        cell = [[RNReactModuleCell alloc] initWithStyle:self.tableViewCellStyle reuseIdentifier:reactModuleForCell bridge: _bridge data:data indexPath:indexPath reactModule:reactModuleForCell tableViewTag:self.reactTag];
    } else {
        [cell setUpAndConfigure:data bridge:_bridge indexPath:indexPath reactModule:reactModuleForCell tableViewTag:self.reactTag];
    }
    return cell;
}

-(UITableViewCell*)setupCollectionViewInsideTableViewCell:(UITableView *)tableView data:(NSDictionary*)data indexPath:(NSIndexPath *)indexPath collectionViewInsideTableViewCell:(NSString *)collectionViewInsideTableViewCell collectionViewInsideTableViewCellKey:(NSString *)collectionViewInsideTableViewCellKey {
    // RCTAssert(_bridge, @"Must set global bridge in AppDelegate, e.g. \n\
              #import <RNTableView/RNAppGlobals.h>\n\
              [[RNAppGlobals sharedInstance] setAppBridge:rootView.bridge]");
    RNTableViewCellWithCollectionViewInside *cell = [tableView dequeueReusableCellWithIdentifier:collectionViewInsideTableViewCellKey];

    if (cell == nil) {
        cell = [[RNTableViewCellWithCollectionViewInside alloc] initWithStyle:self.tableViewCellStyle reuseIdentifier:collectionViewInsideTableViewCellKey];
        SnappingCollectionViewLayout *layout = [[SnappingCollectionViewLayout alloc] init];
        layout.minimumLineSpacing = 8;
        layout.minimumInteritemSpacing = 0;
        layout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
        
        UICollectionView *collectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:layout];
        collectionView.decelerationRate = UIScrollViewDecelerationRateFast;
        collectionView.showsHorizontalScrollIndicator = NO;
        [collectionView setDataSource:cell];
        [collectionView setDelegate:cell];
        [collectionView registerClass:[RNReactModuleCollectionViewCell class] forCellWithReuseIdentifier:collectionViewInsideTableViewCell];
        [collectionView setBackgroundColor:[UIColor clearColor]];

        cell.bridge = _bridge;
        cell.reactTag = self.reactTag;
        cell.onScrollViewDidEndDecelerating = self.onScrollViewDidEndDecelerating;
        cell.onCollectionViewDidSelectItem = self.onCollectionViewDidSelectItem;
        cell.onMoreAccessoryPress = self.onMoreAccessoryPress;
        cell.collectionView = collectionView;
        cell.initialIndex = [data[@"collectionViewInitialIndex"] intValue];
        cell.currentIndex = [data[@"collectionViewInitialIndex"] intValue];
        [collectionView setContentInset:UIEdgeInsetsMake(0.f, 16.f, 0.f, 16.f)];
        [collectionView setContentOffset:CGPointMake(-16.f, 0)];
    }
    
    cell.oldCollectionData = cell.collectionData;
    cell.collectionData = [NSMutableArray arrayWithArray:data[@"collectionViewItems"]];
    [cell reloadInputViews];
    
    return cell;
}

-(UITableViewCell* )tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = nil;
    NSDictionary *item = [self dataForRow:indexPath.item section:indexPath.section];
    
    // check if it is standard cell or user-defined UI
    if ([self hasCustomCells:indexPath.section]){
        cell = ((RNCellView *)_cells[indexPath.section][indexPath.row]).tableViewCell;
    } else if ([item[@"containCollectionView"] intValue] && item[@"collectionViewItems"] != nil) {
        cell = [self setupCollectionViewInsideTableViewCell:tableView data:item indexPath:indexPath collectionViewInsideTableViewCell:item[@"collectionViewInsideTableViewCell"] collectionViewInsideTableViewCellKey:item[@"collectionViewInsideTableViewCellKey"]];
    } else if (item[@"reactModuleForCell"] != nil && ![item[@"reactModuleForCell"] isEqualToString:@""]) {
        cell = [self setupReactModuleCell:tableView data:item indexPath:indexPath reactModuleForCell:item[@"reactModuleForCell"]];
      if (item[@"image"]) {
        UIImage *image;
        if ([item[@"image"] isKindOfClass:[NSString class]])
        {
          image = [UIImage imageNamed:item[@"image"]];
        } else {
          image = [RCTConvert UIImage:item[@"image"]];
        }
        if ([item[@"imageWidth"] intValue]) {
          CGSize itemSize = CGSizeMake([item[@"imageWidth"] intValue], image.size.height);
          CGPoint itemPoint = CGPointMake((itemSize.width - image.size.width) / 2, (itemSize.height - image.size.height) / 2);
          UIGraphicsBeginImageContextWithOptions(itemSize, NO, UIScreen.mainScreen.scale);
          [image drawAtPoint:itemPoint];
          cell.imageView.image = UIGraphicsGetImageFromCurrentImageContext();
          UIGraphicsEndImageContext();
        } else {
          cell.imageView.image = image;
        }
      }
    } else if (self.reactModuleForCell != nil && ![self.reactModuleForCell isEqualToString:@""]) {
        cell = [self setupReactModuleCell:tableView data:item indexPath:indexPath reactModuleForCell:_reactModuleForCell];
    } else {
        cell = [tableView dequeueReusableCellWithIdentifier:@"Cell"];
        if (cell == nil) {
            cell = [[UITableViewCell alloc] initWithStyle:self.tableViewCellStyle reuseIdentifier:@"Cell"];
        }
        cell.textLabel.text = item[@"label"];
        cell.detailTextLabel.text = item[@"detail"];
      
      if (item[@"image"]) {
        UIImage *image;
        if ([item[@"image"] isKindOfClass:[NSString class]])
        {
          image = [UIImage imageNamed:item[@"image"]];
        } else {
          image = [RCTConvert UIImage:item[@"image"]];
        }
        if ([item[@"imageWidth"] intValue]) {
          CGSize itemSize = CGSizeMake([item[@"imageWidth"] intValue], image.size.height);
          CGPoint itemPoint = CGPointMake((itemSize.width - image.size.width) / 2, (itemSize.height - image.size.height) / 2);
          UIGraphicsBeginImageContextWithOptions(itemSize, NO, UIScreen.mainScreen.scale);
          [image drawAtPoint:itemPoint];
          cell.imageView.image = UIGraphicsGetImageFromCurrentImageContext();
          UIGraphicsEndImageContext();
        } else {
          cell.imageView.image = image;
        }
      }
    }
    
    if (item[@"selected"] && [item[@"selected"] intValue]){
        if (item[@"selectedAccessoryType"]) {
            cell.accessoryType = [item[@"selectedAccessoryType"] intValue];
        } else if (item[@"selectedAccessoryImage"]) {
            UIImage *image;
            if ([item[@"selectedAccessoryImage"] isKindOfClass:[NSString class]]) {
                image = [UIImage imageNamed:item[@"selectedAccessoryImage"]];
            } else {
                image = [RCTConvert UIImage:item[@"selectedAccessoryImage"]];
            }
            if ([item[@"selectedAccessoryImageWidth"] intValue]) {
                CGSize itemSize = CGSizeMake([item[@"selectedAccessoryImageWidth"] intValue], [item[@"selectedAccessoryImageWidth"] intValue]);
                CGPoint itemPoint = CGPointMake((itemSize.width - image.size.width) / 2, (itemSize.height - image.size.height) / 2);
                UIGraphicsBeginImageContextWithOptions(itemSize, NO, UIScreen.mainScreen.scale);
                [image drawAtPoint:itemPoint];
            }
                
            UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
            CGRect frame = CGRectMake(0.0, 0.0, [item[@"selectedAccessoryImageWidth"] intValue] ? [item[@"selectedAccessoryImageWidth"] intValue] : image.size.width, [item[@"selectedAccessoryImageWidth"] intValue] ? [item[@"selectedAccessoryImageWidth"] intValue] : image.size.height);
            button.frame = frame;
            [button setBackgroundImage:image forState:UIControlStateNormal];
                
            if ([item[@"leftAccessoryImage"] intValue]) {
                for (UIView *subView in cell.subviews) {
                    if (subView.tag == 100001) {
                        [subView removeFromSuperview];
                    }
                }

                button.tag = 100001;
                button.center = CGPointMake(16 + button.frame.size.width / 2, [item[@"cellHeight"] intValue] / 2);
                [cell addSubview:button];
            } else {
                cell.accessoryView = button;
            }
        } else {
            cell.accessoryView = nil;
            cell.accessoryType = UITableViewCellAccessoryCheckmark;
        }
    } else {
        if ([item[@"leftAccessoryImage"] intValue]) { 
            for (UIView *subView in cell.subviews) {
                if (subView.tag == 100001) {
                    [subView removeFromSuperview];
                }
            }
        }
    }


        if ([item[@"arrow"] intValue]) {
            cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
        } else if ([item[@"accessoryType"] intValue]) {
            if ([item[@"accessoryType"] intValue] == 5) {
              UISwitch *switchView = [[UISwitch alloc] initWithFrame:CGRectZero];
              cell.accessoryView = switchView;
              [switchView setOn:[item[@"switchOn"] intValue] animated:NO];
              switchView.tag = ((indexPath.section * 10000) + 30000) + (indexPath.item * 10);
              [switchView addTarget:self action:@selector(switchAccessoryChangedForRowWithIndexPath:) forControlEvents:UIControlEventValueChanged];
            } else if ([item[@"accessoryType"] intValue] == 6) {
              UIView *circleView = [[UIView alloc] initWithFrame:CGRectMake(0,0,20,20)];
              circleView.layer.cornerRadius = 10;
              circleView.backgroundColor = [UIColor clearColor];
              circleView.layer.borderWidth = 1.0f;
              circleView.layer.borderColor = [UIColor colorWithRed:200/255.0 green:199/255.0 blue:204/255.0 alpha:1.0].CGColor;
              cell.accessoryView = circleView;
            } else if ([item[@"accessoryType"] intValue] == 7) {
              UIButton *addButton = [UIButton buttonWithType: UIButtonTypeContactAdd];
              addButton.tag = 100002;
              [addButton addTarget:self action:@selector(addButtonClick:) forControlEvents:UIControlEventTouchUpInside];
              cell.accessoryView = addButton;
            } else {
              cell.accessoryType = [item[@"accessoryType"] intValue];
              cell.accessoryView = nil;
            }
        } else {
            cell.accessoryType = UITableViewCellAccessoryNone;
            cell.accessoryView = nil;
        }

    if ([item[@"transparent"] intValue]) {
        cell.backgroundColor = [UIColor clearColor];
    }
    if (item[@"selectionStyle"] != nil) {
        cell.selectionStyle = [RCTConvert int:item[@"selectionStyle"]];
    }
    cell.transform = CGAffineTransformIdentity;
    return cell;
}

-(void)addButtonClick:(UIButton*)sender
{
  CGPoint touchPoint = [sender convertPoint:CGPointZero toView: self.tableView];
  NSIndexPath *indexPath = [self.tableView indexPathForRowAtPoint:touchPoint];
  NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
  newValue[@"target"] = self.reactTag;
  newValue[@"accessoryIndex"] = [NSNumber numberWithInteger:indexPath.item];
  newValue[@"accessorySection"] = [NSNumber numberWithInteger:indexPath.section];

  self.onAddAccessoryPress(newValue);
}

- (void)switchAccessoryChangedForRowWithIndexPath:(id)sender {
    UISwitch *switchControl = sender;
    NSInteger tag = switchControl.tag;
    NSInteger row = ((tag - 30000) % 10000) / 10;
    NSInteger section = ((tag - (row * 10)) - 30000) / 10000;

    NSMutableDictionary *newValue = [self dataForRow:row section:section];
    newValue[@"target"] = self.reactTag;
    newValue[@"accessoryIndex"] = [NSNumber numberWithInteger:row];
    newValue[@"accessorySection"] = [NSNumber numberWithInteger:section];

    if (switchControl.on) {
      [newValue setObject:@1 forKey:@"switchOn"];
    } else {
      [newValue setObject:@0 forKey:@"switchOn"];
    }

    self.onSwitchAccessoryChanged(newValue);
}

-(NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return _sections[section][@"label"];
}

-(NSString *)tableView:(UITableView *)tableView titleForFooterInSection:(NSInteger)section {
    return _sections[section][@"footerLabel"];
}

-(NSMutableDictionary *)dataForRow:(NSInteger)row section:(NSInteger)section {
    return (NSMutableDictionary *)_sections[section][@"items"][row];
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (![self hasCustomCells:indexPath.section]){
        NSNumber *styleHeight = _sections[indexPath.section][@"items"][indexPath.row][@"height"];
        return styleHeight.floatValue ?: _cellHeight;
    } else {
        RNCellView *cell = (RNCellView *)_cells[indexPath.section][indexPath.row];
        CGFloat height =  cell.componentHeight;
        return height;
    }
    
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:NO];
    
    NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
    newValue[@"target"] = self.reactTag;
    newValue[@"selectedIndex"] = [NSNumber numberWithInteger:indexPath.item];
    newValue[@"selectedSection"] = [NSNumber numberWithInteger:indexPath.section];
    
    /*
     * if allowToggle is enabled and we tap an already selected row, then remove the selection.
     * otherwise, add selection to the new row and remove selection from old row if multiple is not allowed.
     * default: allowMultipleSelection:false and allowToggle: false
     */
    if (self.selectedValue){
        if (_allowsToggle && newValue[@"selected"] && [newValue[@"selected"] intValue]) {
            [newValue removeObjectForKey:@"selected"];
        } else {
            if (!_allowsMultipleSelection) {
                [_lastValue removeObjectForKey:@"selected"];
            }
            
            [newValue setObject:@1 forKey:@"selected"];
        }
        [self.tableView reloadData];
    }
    
    if (!newValue[@"disablePress"] || ![newValue[@"disablePress"] intValue]) {
      self.onPress(newValue);
    }
    
    self.selectedIndexes[indexPath.section] = [NSNumber numberWithInteger:indexPath.item];
    _lastValue = newValue;
}

- (void)tableView:(UITableView *)tableView accessoryButtonTappedForRowWithIndexPath:(NSIndexPath *)indexPath {
    NSLog(@"accessoryButtonTappedForRowWithIndexPath %@", indexPath);
    NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
    newValue[@"target"] = self.reactTag;
    newValue[@"accessoryIndex"] = [NSNumber numberWithInteger:indexPath.item];
    newValue[@"accessorySection"] = [NSNumber numberWithInteger:indexPath.section];
    
    self.onAccessoryPress(newValue);
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary *value = [self dataForRow:indexPath.item section:indexPath.section];
    return [value[@"canEdit"] boolValue];
}

- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary *value = [self dataForRow:indexPath.item section:indexPath.section];
    return [value[@"canMove"] boolValue];
}

- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)sourceIndexPath toIndexPath:(NSIndexPath *)destinationIndexPath {
    self.onChange(@{@"target":self.reactTag, @"sourceIndex":@(sourceIndexPath.row), @"sourceSection": @(sourceIndexPath.section), @"destinationIndex":@(destinationIndexPath.row), @"destinationSection":@(destinationIndexPath.section), @"mode": @"move"});
}

- (NSIndexPath *)tableView:(UITableView *)tableView targetIndexPathForMoveFromRowAtIndexPath:(NSIndexPath *)sourceIndexPath toProposedIndexPath:(NSIndexPath *)proposedDestinationIndexPath {
    if (self.moveWithinSectionOnly && sourceIndexPath.section != proposedDestinationIndexPath.section) {
        return sourceIndexPath;
    }
    return proposedDestinationIndexPath;
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath { //implement the delegate method
    
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
        newValue[@"target"] = self.reactTag;
        newValue[@"selectedIndex"] = [NSNumber numberWithInteger:indexPath.item];
        newValue[@"selectedSection"] = [NSNumber numberWithInteger:indexPath.section];
        newValue[@"mode"] = @"delete";
        
        self.onChange(newValue);
        
        [_sections[indexPath.section][@"items"] removeObjectAtIndex:indexPath.row];
        [self.tableView reloadData];
    } else if (editingStyle == UITableViewCellEditingStyleInsert) {
        NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
        newValue[@"target"] = self.reactTag;
        newValue[@"selectedIndex"] = [NSNumber numberWithInteger:indexPath.item];
        newValue[@"selectedSection"] = [NSNumber numberWithInteger:indexPath.section];
        newValue[@"mode"] = @"insert";
        
        self.onChange(newValue);
        [self.tableView reloadData];
    }
}

-(UITableViewCellEditingStyle)tableView:(UITableView *)tableView
          editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath{
    return self.tableViewCellEditingStyle;
}

- (UISwipeActionsConfiguration *)tableView:(UITableView *)tableView leadingSwipeActionsConfigurationForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
    
    if ([newValue[@"swipeable"] intValue]) {
    UIContextualAction *leadingSwipeAction = [UIContextualAction contextualActionWithStyle:UIContextualActionStyleNormal title:[NSString stringWithString: newValue[@"leadingTitle"]] handler:^(UIContextualAction * _Nonnull action, __kindof UIView * _Nonnull sourceView, void (^ _Nonnull completionHandler)(BOOL)) {
        self.onLeadingSwipe(newValue);
        completionHandler(YES);
    }];
    
        if (newValue[@"leadingImage"]) {
            UIImage *leadingImage;
            if ([newValue[@"leadingImage"] isKindOfClass:[NSString class]])
            {
                leadingImage = [UIImage imageNamed:newValue[@"leadingImage"]];
            } else {
                leadingImage = [RCTConvert UIImage:newValue[@"leadingImage"]];
            }
            
            leadingSwipeAction.image = leadingImage;
        }
        
        leadingSwipeAction.backgroundColor = [UIColor colorWithRed:0.0f/255.0f
                                                             green:122.0f/255.0f
                                                              blue:255.0f/255.0f
                                                             alpha:1.0f];
    UISwipeActionsConfiguration *SwipeActions = [UISwipeActionsConfiguration configurationWithActions:@[leadingSwipeAction]];
    SwipeActions.performsFirstActionWithFullSwipe = true;
    
        return SwipeActions;
    } else {
        return nil;
    }
}

- (UISwipeActionsConfiguration *)tableView:(UITableView *)tableView trailingSwipeActionsConfigurationForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary *newValue = [self dataForRow:indexPath.item section:indexPath.section];
    
    if ([newValue[@"swipeable"] intValue]) {
    UIContextualAction *trailingSwipeAction = [UIContextualAction contextualActionWithStyle:UIContextualActionStyleNormal title:[NSString stringWithString: newValue[@"trailingTitle"]] handler:^(UIContextualAction * _Nonnull action, __kindof UIView * _Nonnull sourceView, void (^ _Nonnull completionHandler)(BOOL)) {
        self.onTrailingSwipe(newValue);
        completionHandler(YES);
    }];

        if (newValue[@"trailingImage"]) {
            UIImage *trailingImage;
            if ([newValue[@"trailingImage"] isKindOfClass:[NSString class]])
            {
                trailingImage = [UIImage imageNamed:newValue[@"trailingImage"]];
            } else {
                trailingImage = [RCTConvert UIImage:newValue[@"trailingImage"]];
            }

            trailingSwipeAction.image = trailingImage;
        }
        
        trailingSwipeAction.backgroundColor = [UIColor colorWithRed:94.0f/255.0f
                                                              green:184.0f/255.0f
                                                               blue:93.0f/255.0f
                                                              alpha:1.0f];
        
    
    UISwipeActionsConfiguration *SwipeActions = [UISwipeActionsConfiguration configurationWithActions:@[trailingSwipeAction]];
    SwipeActions.performsFirstActionWithFullSwipe = true;
        return SwipeActions;
    } else {
        return nil;
    }
}

-(BOOL)tableView:(UITableView *)tableView shouldIndentWhileEditingRowAtIndexPath:(NSIndexPath *)indexPath{
    if (self.tableViewCellEditingStyle == UITableViewCellEditingStyleNone) {
        return NO;
    }
    return YES;
}

-(BOOL)hasCustomCells:(NSInteger)section {
    return [[_sections[section] valueForKey:@"customCells"] boolValue];
}

#pragma mark - Scrolling

-(void)scrollViewDidScroll:(UIScrollView *)scrollView {
  if (_scrollToDismissEnabled) {
    [SPStorkController2 scrollViewDidScroll: scrollView];
  }
  
    if (!self.onScroll) {
        // When rendering, `self.tableView.delegate` may be set before `onScroll` is passed in.
        return;
    }

    self.onScroll(@{
                    @"target": self.reactTag,
                    @"contentOffset": @{
                            @"x": @(_tableView.contentOffset.x),
                            @"y": @(_tableView.contentOffset.y)
                            }
                    });
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate{
    
    // UITableView only moves in one direction, y axis
    CGFloat currentOffset = scrollView.contentOffset.y;
    CGFloat maximumOffset = scrollView.contentSize.height - scrollView.frame.size.height;
    
    //NSInteger result = maximumOffset - currentOffset;
    
    // Change 10.0 to adjust the distance from bottom
    if ((maximumOffset - currentOffset <= 10.0)) {
        if (self.canLoadMore) {
            self.onLoadMore(@{});
        }
    }
}

- (void)batchUpdates {
    NSMutableArray *oldData = [NSMutableArray arrayWithCapacity:[self.oldSections count]];
    for (NSUInteger i = 0, count = [_oldSections count]; i < count; i++) {
        NSMutableArray *oldSection = [NSMutableArray arrayWithCapacity:[[[_oldSections objectAtIndex:i] objectForKey:@"items"] count]];
        for (NSUInteger j = 0, jcount = [[[_oldSections objectAtIndex:i] objectForKey:@"items"] count]; j < jcount; j++) {
            NSString *key = [[[_oldSections objectAtIndex:i] objectForKey:@"items"] objectAtIndex:j] != NULL ? [[[[_oldSections objectAtIndex:i] objectForKey:@"items"] objectAtIndex:j] valueForKey:@"uid"] : [NSString stringWithFormat:@"%lu",(unsigned long)(i * 10 + j)];
            [oldSection addObject:genDiffableObject(key, [[[_oldSections objectAtIndex:i] objectForKey:@"items"] objectAtIndex:j])];
        }
        NSString *sectionKey = [[_oldSections objectAtIndex:i] objectForKey:@"uid"] != NULL ? [[_oldSections objectAtIndex:i] objectForKey:@"uid"] : [NSString stringWithFormat:@"%lu",(unsigned long)i];
        [oldData addObject: genDiffableObject(sectionKey, oldSection)];
    }
    NSLog(@"oldData: %@", oldData);
    
    NSMutableArray *newData = [NSMutableArray arrayWithCapacity:[_sections count]];
    for (NSUInteger i = 0, count = [_sections count]; i < count; i++) {
        NSMutableArray *section = [NSMutableArray arrayWithCapacity:[[[_sections objectAtIndex:i] objectForKey:@"items"] count]];
        for (NSUInteger j = 0, jcount = [[[_sections objectAtIndex:i] objectForKey:@"items"] count]; j < jcount; j++) {
            NSString *key = [[[_sections objectAtIndex:i] objectForKey:@"items"] objectAtIndex:j] != NULL ? [[[[_sections objectAtIndex:i] objectForKey:@"items"] objectAtIndex:j] valueForKey:@"uid"] : [NSString stringWithFormat:@"%lu",(unsigned long)(i * 10 + j)];
            [section addObject:genDiffableObject(key, [[[_sections objectAtIndex:i] objectForKey:@"items"] objectAtIndex:j])];
        }
        NSString *sectionKey = [[_sections objectAtIndex:i] objectForKey:@"uid"] != NULL ? [[_sections objectAtIndex:i] objectForKey:@"uid"] : [NSString stringWithFormat:@"%lu",(unsigned long)i];
        [newData addObject: genDiffableObject(sectionKey, section)];
    }
    NSLog(@"newData: %@", newData);
    
    IGListIndexSetResult *change = IGListDiff(oldData, newData, IGListDiffEquality);
    
    NSMutableArray *insertIndexPaths = [[NSMutableArray alloc] init];
    [change.inserts enumerateIndexesUsingBlock:^(NSUInteger idx, BOOL * _Nonnull stop)
     {
         NSIndexPath *indexPath = [NSIndexPath indexPathForItem:idx inSection:0];
         [insertIndexPaths addObject:indexPath];
     }];
    // NSLog(@"insertIndexPaths: %@", insertIndexPaths);
    
    NSMutableArray *deleteIndexPaths = [[NSMutableArray alloc] init];
    [change.deletes enumerateIndexesUsingBlock:^(NSUInteger idx, BOOL * _Nonnull stop)
     {
         NSIndexPath *indexPath = [NSIndexPath indexPathForItem:idx inSection:0];
         [deleteIndexPaths addObject:indexPath];
     }];
    // NSLog(@"deleteIndexPaths: %@", deleteIndexPaths);
    
    NSMutableArray *updateIndexPaths = [[NSMutableArray alloc] init];
    [change.updates enumerateIndexesUsingBlock:^(NSUInteger idx, BOOL * _Nonnull stop)
     {
         NSIndexPath *indexPath = [NSIndexPath indexPathForItem:idx inSection:0];
         [updateIndexPaths addObject:indexPath];
     }];
    // NSLog(@"updateIndexPaths: %@", updateIndexPaths);
}

@end
