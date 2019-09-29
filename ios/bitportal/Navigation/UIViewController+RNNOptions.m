#import "UIViewController+RNNOptions.h"
#import <React/RCTRootView.h>

#define kStatusBarAnimationDuration 0.35
const NSInteger BLUR_STATUS_TAG = 78264801;

@implementation UIViewController (RNNOptions)

- (void)rnn_setBackgroundImage:(UIImage *)backgroundImage {
  if (@available(iOS 13.0, *)) {

  } else {
    if (backgroundImage) {
      UIImageView* backgroundImageView = (self.view.subviews.count > 0) ? self.view.subviews[0] : nil;
      if (![backgroundImageView isKindOfClass:[UIImageView class]]) {
        backgroundImageView = [[UIImageView alloc] initWithFrame:self.view.bounds];
        [self.view insertSubview:backgroundImageView atIndex:0];
      }
      
      backgroundImageView.layer.masksToBounds = YES;
      backgroundImageView.image = backgroundImage;
      [backgroundImageView setContentMode:UIViewContentModeScaleAspectFill];
    }
  }
}

- (void)rnn_setModalPresentationStyle:(UIModalPresentationStyle)modalPresentationStyle {
	self.modalPresentationStyle = modalPresentationStyle;
}

- (void)rnn_setModalTransitionStyle:(UIModalTransitionStyle)modalTransitionStyle {
	self.modalTransitionStyle = modalTransitionStyle;
}

- (void)rnn_setSearchBarWithPlaceholder:(NSString *)placeholder 
						hideNavBarOnFocusSearchBar:(BOOL)hideNavBarOnFocusSearchBar {
	if (@available(iOS 11.0, *)) {
		if (!self.navigationItem.searchController) {
			UISearchController *search = [[UISearchController alloc]initWithSearchResultsController:nil];
			search.dimsBackgroundDuringPresentation = NO;
			if ([self conformsToProtocol:@protocol(UISearchResultsUpdating)]) {
				[search setSearchResultsUpdater:((UIViewController <UISearchResultsUpdating> *) self)];
			}
			search.searchBar.delegate = (id<UISearchBarDelegate>)self;
			if (placeholder) {
				search.searchBar.placeholder = placeholder;
			}
			search.searchBar.autocapitalizationType = UITextAutocapitalizationTypeNone;
			search.hidesNavigationBarDuringPresentation = hideNavBarOnFocusSearchBar;
			self.navigationItem.searchController = search;
			[self.navigationItem setHidesSearchBarWhenScrolling:YES];
			// Fixes #3450, otherwise, UIKit will infer the presentation context to be the root most view controller
			self.definesPresentationContext = YES;
		}
	}
}

- (void)rnn_setSearchBarHiddenWhenScrolling:(BOOL)searchBarHidden {
	if (@available(iOS 11.0, *)) {
		self.navigationItem.hidesSearchBarWhenScrolling = searchBarHidden;
	}
}

- (void)rnn_setSearchBarDeactive {
	if (@available(iOS 11.0, *)) {
		self.navigationItem.searchController.active = NO;
	}
}

- (void)rnn_setNavigationItemTitle:(NSString *)title {
	self.navigationItem.title = title;
}

- (void)rnn_setDrawBehindTopBar:(BOOL)drawBehind {
  if (@available(iOS 13.0, *)) {
    
  } else {
    if (drawBehind) {
      [self setExtendedLayoutIncludesOpaqueBars:YES];
      self.edgesForExtendedLayout |= UIRectEdgeTop;
    } else {
      self.edgesForExtendedLayout &= ~UIRectEdgeTop;
    }
  }
}

- (void)rnn_setDrawBehindTabBar:(BOOL)drawBehindTabBar {
  if (@available(iOS 13.0, *)) {
    
  } else {
    if (drawBehindTabBar) {
      [self setExtendedLayoutIncludesOpaqueBars:YES];
      self.edgesForExtendedLayout |= UIRectEdgeBottom;
    } else {
      self.edgesForExtendedLayout &= ~UIRectEdgeBottom;
    }
  }
}

- (void)rnn_setTabBarItemBadge:(NSString *)badge {
	UITabBarItem *tabBarItem = self.tabBarItem;
	
	if ([badge isKindOfClass:[NSNull class]] || [badge isEqualToString:@""]) {
		tabBarItem.badgeValue = nil;
	} else {
		tabBarItem.badgeValue = badge;
	}
}

- (void)rnn_setTabBarItemBadgeColor:(UIColor *)badgeColor {
	if (@available(iOS 10.0, *)) {
		self.tabBarItem.badgeColor = badgeColor;
	}
}

- (void)rnn_setStatusBarStyle:(NSString *)style animated:(BOOL)animated {
  if (animated) {
    [UIView animateWithDuration:[self statusBarAnimationDuration:animated] animations:^{
      [self setNeedsStatusBarAppearanceUpdate];
    }];
  } else {
    [self setNeedsStatusBarAppearanceUpdate];
  }
}

- (void)rnn_setTopBarLargeTitleDisplayMode:(UINavigationItemLargeTitleDisplayMode)displayMode API_AVAILABLE(ios(11.0)) {
	if (@available(iOS 11.0, *)) {
    self.navigationItem.largeTitleDisplayMode = displayMode;
	}
}


- (void)rnn_setStatusBarBlur:(BOOL)blur {
	UIView* curBlurView = [self.view viewWithTag:BLUR_STATUS_TAG];
	if (blur) {
		if (!curBlurView) {
			UIVisualEffectView *blur = [[UIVisualEffectView alloc] initWithEffect:[UIBlurEffect effectWithStyle:UIBlurEffectStyleLight]];
			blur.frame = [[UIApplication sharedApplication] statusBarFrame];
			blur.tag = BLUR_STATUS_TAG;
			[self.view insertSubview:blur atIndex:0];
		}
	} else {
		if (curBlurView) {
			[curBlurView removeFromSuperview];
		}
	}
}

- (void)rnn_setBackgroundColor:(UIColor *)backgroundColor {
  if (@available(iOS 13.0, *)) {
    self.view.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    self.view.backgroundColor = backgroundColor;
  }
}

- (void)rnn_setBackButtonVisible:(BOOL)visible {
	self.navigationItem.hidesBackButton = !visible;
}

- (CGFloat)statusBarAnimationDuration:(BOOL)animated {
	return animated ? kStatusBarAnimationDuration : CGFLOAT_MIN;
}

- (BOOL)isModal {
	if([self presentingViewController])
		return YES;
	if([[[self navigationController] presentingViewController] presentedViewController] == [self navigationController])
		return YES;
	if([[[self tabBarController] presentingViewController] isKindOfClass:[UITabBarController class]])
		return YES;
	
	return NO;
}

- (void)rnn_setInterceptTouchOutside:(BOOL)interceptTouchOutside {
	if ([self.view isKindOfClass:[RCTRootView class]]) {
		RCTRootView* rootView = (RCTRootView*)self.view;
		rootView.passThroughTouches = !interceptTouchOutside;
	}
}

@end
