//
//  SnappingCollectionViewLayout.m
//  RNTableView
//
//  Created by Terence Ge on 2018/11/6.
//  Copyright © 2018 Pavlo Aksonov. All rights reserved.
//

#import "SnappingCollectionViewLayout.h"

@implementation SnappingCollectionViewLayout

- (CGPoint)targetContentOffsetForProposedContentOffset:(CGPoint)proposedContentOffset withScrollingVelocity:(CGPoint)velocity {
    if (self.collectionView == nil) {
        return [super targetContentOffsetForProposedContentOffset: proposedContentOffset withScrollingVelocity: velocity];
    }
    
    CGFloat offsetAdjustment = FLT_MAX;
    CGFloat horizontalOffset = proposedContentOffset.x + self.collectionView.contentInset.left;
    
    CGRect targetRect = CGRectMake(proposedContentOffset.x, 0, self.collectionView.bounds.size.width, self.collectionView.bounds.size.height);
    
    NSArray * layoutAttributesArray = [super layoutAttributesForElementsInRect: targetRect];
    
    for (UICollectionViewLayoutAttributes *layoutAttributes in layoutAttributesArray) {
        CGFloat itemOffset = layoutAttributes.frame.origin.x;
        CGFloat itemWidth = layoutAttributes.frame.size.width;
        CGFloat direction = velocity.x > 0 ? 1 : -1;
        if (fabs(itemOffset - horizontalOffset) < fabs(offsetAdjustment) + itemWidth * direction) {
            offsetAdjustment = itemOffset - horizontalOffset;
        }
    }
    
    return CGPointMake(proposedContentOffset.x + offsetAdjustment, proposedContentOffset.y);
}

@end
