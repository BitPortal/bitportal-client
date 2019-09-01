//
//  RNTableViewCellWithCollectionViewInside.m
//  RNTableView
//
//  Created by Terence Ge on 2018/11/6.
//  Copyright © 2018 Pavlo Aksonov. All rights reserved.
//

#import "RNTableViewCellWithCollectionViewInside.h"
#import "RNReactModuleCollectionViewCell.h"
#import "DiffableObject.h"
#import <IGListKit/IGListKit.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

@implementation RNTableViewCellWithCollectionViewInside

-(void)setCollectionView:(UICollectionView *)collectionView {
    _collectionView = collectionView;
    [self.contentView addSubview:collectionView];
}

-(void)setFrame:(CGRect)frame {
    [super setFrame:frame];
    [_collectionView setFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
}

- (void)reloadInputViews
{
    NSMutableArray *oldData = [[NSMutableArray alloc] init];
    for (NSUInteger i = 0, count = [self.oldCollectionData count]; i < count; i++) {
        NSString *key = [self.oldCollectionData objectAtIndex:i] != NULL ? [[self.oldCollectionData objectAtIndex:i] valueForKey:@"uid"] : [NSString stringWithFormat:@"%lu",(unsigned long)i];
        [oldData addObject:genDiffableObject(key, [self.oldCollectionData objectAtIndex:i])];
    }
    
    NSMutableArray *newData = [[NSMutableArray alloc] init];
    for (NSUInteger i = 0, count = [self.collectionData count]; i < count; i++) {
        NSString *key = [self.collectionData objectAtIndex:i] != NULL ? [[self.collectionData objectAtIndex:i] valueForKey:@"uid"] : [NSString stringWithFormat:@"%lu",(unsigned long)i];
        [newData addObject:genDiffableObject(key, [self.collectionData objectAtIndex:i])];
    }
    
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
    
    // [self.collectionView reloadData];
    // _count = self.collectionData.count;

    dispatch_async(dispatch_get_main_queue(),
                   ^{
                       [self.collectionView performBatchUpdates:^{
                           [self.collectionView deleteItemsAtIndexPaths:deleteIndexPaths];
                           [self.collectionView reloadItemsAtIndexPaths:updateIndexPaths];
                           [self.collectionView insertItemsAtIndexPaths:insertIndexPaths];
                           _count = _count - deleteIndexPaths.count + insertIndexPaths.count;
                       } completion:^(BOOL finished) {
                           if (_initialIndex > -1 && _initialIndex < _count) {
                               NSIndexPath *indexPath = [NSIndexPath indexPathForItem:_initialIndex inSection:0];
                               [self.collectionView scrollToItemAtIndexPath:indexPath atScrollPosition: UICollectionViewScrollPositionCenteredHorizontally animated:NO];
                               _initialIndex = -1;
                           }
                       }];
                   });
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return _count;
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
    // for (UICollectionViewCell *cell in [self.collectionView visibleCells]) {
    //     NSIndexPath *indexPath = [self.collectionView indexPathForCell:cell];
    //     NSLog(@"%@",indexPath);
    // }
    CGFloat width = scrollView.frame.size.width;
    CGFloat offsetX = scrollView.contentOffset.x;
    NSInteger page = roundf((offsetX + (0.5f * width)) / width);
    _currentIndex = page;
    self.onScrollViewDidEndDecelerating(@{ @"page":  [@(page) stringValue], @"action": @"end" });
}

//- (void)scrollViewDidScroll:(UIScrollView *)scrollView{
//    CGFloat width = scrollView.frame.size.width;
//    NSInteger page = (scrollView.contentOffset.x + (0.5f * width)) / width;
//    _currentIndex = page;
//    self.onScrollViewDidEndDecelerating(@{ @"page":  [@(page) stringValue] });
//}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView {
    CGFloat width = scrollView.frame.size.width;
    CGFloat offsetX = scrollView.contentOffset.x;
    NSInteger page = roundf((offsetX + (0.5f * width)) / width);
    _currentIndex = page;
    self.onScrollViewDidEndDecelerating(@{ @"page":  [@(page) stringValue], @"action": @"start" });
}

-(UICollectionViewCell*)setupReactModuleCell:(UICollectionView *)collectionView data:(NSDictionary*)data indexPath:(NSIndexPath *)indexPath reactModuleForCell:(NSString *)reactModuleForCell {
    RCTAssert(_bridge, @"Must set global bridge in AppDelegate, e.g. \n\
              #import <RNTableView/RNAppGlobals.h>\n\
              [[RNAppGlobals sharedInstance] setAppBridge:rootView.bridge]");
    RNReactModuleCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reactModuleForCell forIndexPath:indexPath];
    // if (cell == nil) {
        [cell setUpAndConfigure:data bridge:self.bridge indexPath:indexPath reactModule:reactModuleForCell tableViewTag:self.reactTag];
        cell.onMoreAccessoryPress = self.onMoreAccessoryPress;
       cell.data = [self.collectionData objectAtIndex: indexPath.item];
        // cell.layer.borderColor = [UIColor greenColor].CGColor;
        // cell.layer.borderWidth = 1.0f;
    // }
    return cell;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    UICollectionViewCell *cell = nil;
    NSMutableDictionary *itemData = [self.collectionData objectAtIndex: indexPath.item];
    if (itemData[@"reactModuleForCollectionViewCell"] != nil && ![itemData[@"reactModuleForCollectionViewCell"] isEqualToString:@""]) {
        cell = [self setupReactModuleCell:collectionView data:itemData indexPath:indexPath reactModuleForCell:itemData[@"reactModuleForCollectionViewCell"]];
      
    } else {
        cell = [collectionView dequeueReusableCellWithReuseIdentifier:itemData[@"reactModuleForCollectionViewCell"] forIndexPath:indexPath];
    }
    
    //    cell.backgroundColor=[UIColor greenColor];
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *itemData = [self.collectionData objectAtIndex: indexPath.item];
    return CGSizeMake(self.frame.size.width - 32, [itemData[@"height"] intValue]);
}

-(void)scrollToItem: (NSInteger)index animated:(BOOL)animated {
    // dispatch_async(dispatch_get_main_queue(), ^{
        if (index < _count && index != _currentIndex) {
            NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
            [self.collectionView scrollToItemAtIndexPath:indexPath atScrollPosition: UICollectionViewScrollPositionCenteredHorizontally animated:animated];
            _currentIndex = index;
        }
    // });
}

//- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
//    NSMutableDictionary *itemData = [self.collectionData objectAtIndex: indexPath.item];
//    self.onCollectionViewDidSelectItem(itemData);
//}

@end
