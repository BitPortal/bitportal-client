#import "RNNNavigationController.h"
#import "RNNRootViewController.h"
#import "InteractivePopGestureDelegate.h"

const NSInteger TOP_BAR_TRANSPARENT_TAG = 78264803;

@interface RNNNavigationController()

@property (nonatomic, strong) NSMutableDictionary* originalTopBarImages;

@end

@implementation RNNNavigationController

- (UINavigationBarAppearance*)getNavigaitonBarStandardAppearance  API_AVAILABLE(ios(13.0)) {
  if (!self.navigationBar.standardAppearance) {
    self.navigationBar.standardAppearance = [UINavigationBarAppearance new];
  }
  return self.navigationBar.standardAppearance;
}

- (UINavigationBarAppearance*)getNavigaitonBarCompactAppearance  API_AVAILABLE(ios(13.0)) {
  if (!self.navigationBar.compactAppearance) {
    self.navigationBar.compactAppearance = [UINavigationBarAppearance new];
  }
  return self.navigationBar.compactAppearance;
}

- (UINavigationBarAppearance*)getNavigaitonBarScrollEdgeAppearance  API_AVAILABLE(ios(13.0)) {
  if (!self.navigationBar.scrollEdgeAppearance) {
    self.navigationBar.scrollEdgeAppearance = [UINavigationBarAppearance new];
  }
  return self.navigationBar.scrollEdgeAppearance;
}

- (void)viewDidLayoutSubviews {
	[super viewDidLayoutSubviews];
	[self.presenter applyOptionsOnViewDidLayoutSubviews:self.resolveOptions];
}

- (UIViewController *)getCurrentChild {
	return self.topViewController;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
	return self.getCurrentChild.supportedInterfaceOrientations;
}

- (UINavigationController *)navigationController {
	return self;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
	return self.getCurrentChild.preferredStatusBarStyle;
}

- (UIModalPresentationStyle)modalPresentationStyle {
	return self.getCurrentChild.modalPresentationStyle;
}

- (UIViewController *)popViewControllerAnimated:(BOOL)animated {
	if (self.viewControllers.count > 1) {
		UIViewController *controller = self.viewControllers[self.viewControllers.count - 2];
		if ([controller isKindOfClass:[RNNRootViewController class]]) {
			RNNRootViewController *rnnController = (RNNRootViewController *)controller;
			[self.presenter applyOptionsBeforePopping:rnnController.resolveOptions];
		}
	}
	
	return [super popViewControllerAnimated:animated];
}

- (UIViewController *)childViewControllerForStatusBarStyle {
	return self.topViewController;
}

- (void)setTopBarBackgroundColor:(UIColor *)backgroundColor {
	if (backgroundColor) {
		CGFloat bgColorAlpha = CGColorGetAlpha(backgroundColor.CGColor);
		
		if (bgColorAlpha == 0.0) {
      
      if (@available(iOS 13.0, *)) {
//        UINavigationBarAppearance *standardAppearance = [UINavigationBarAppearance new];
//        [standardAppearance configureWithTransparentBackground];
//        self.navigationBar.standardAppearance = standardAppearance;
//        UINavigationBarAppearance *compactAppearance = [UINavigationBarAppearance new];
//        [compactAppearance configureWithTransparentBackground];
//        self.navigationBar.compactAppearance = compactAppearance;
//        UINavigationBarAppearance *scrollEdgeAppearance = [UINavigationBarAppearance new];
//        [scrollEdgeAppearance configureWithTransparentBackground];
//        self.navigationBar.scrollEdgeAppearance = scrollEdgeAppearance;
      } else {
        
        if (![self.navigationBar viewWithTag:TOP_BAR_TRANSPARENT_TAG]){
          [self storeOriginalTopBarImages:self];
          UIView *transparentView = [[UIView alloc] initWithFrame:CGRectZero];
          transparentView.backgroundColor = [UIColor clearColor];
          transparentView.tag = TOP_BAR_TRANSPARENT_TAG;
          [self.navigationBar insertSubview:transparentView atIndex:0];
        }
        self.navigationBar.translucent = YES;
        [self.navigationBar setBackgroundColor:[UIColor clearColor]];
        self.navigationBar.shadowImage = [UIImage new];
        [self.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
      }
		} else {
      if (@available(iOS 13.0, *)) {
//        UINavigationBarAppearance *standardAppearance = [UINavigationBarAppearance new];
//        [standardAppearance configureWithDefaultBackground];
//        self.navigationBar.standardAppearance = standardAppearance;
//        UINavigationBarAppearance *compactAppearance = [UINavigationBarAppearance new];
//        [compactAppearance configureWithDefaultBackground];
//        self.navigationBar.compactAppearance = compactAppearance;
//        UINavigationBarAppearance *scrollEdgeAppearance = [UINavigationBarAppearance new];
//        [scrollEdgeAppearance configureWithTransparentBackground];
//        self.navigationBar.scrollEdgeAppearance = scrollEdgeAppearance;
        
//        [self getNavigaitonBarStandardAppearance].backgroundColor =  backgroundColor;
//        [self getNavigaitonBarCompactAppearance].backgroundColor = backgroundColor;
//        [self getNavigaitonBarScrollEdgeAppearance].backgroundColor = backgroundColor;
      } else {
        self.navigationBar.barTintColor = backgroundColor;
        UIView *transparentView = [self.navigationBar viewWithTag:TOP_BAR_TRANSPARENT_TAG];
        if (transparentView){
          [transparentView removeFromSuperview];
          [self.navigationBar setBackgroundImage:self.originalTopBarImages[@"backgroundImage"] forBarMetrics:UIBarMetricsDefault];
          self.navigationBar.shadowImage = self.originalTopBarImages[@"shadowImage"];
          self.originalTopBarImages = nil;
        }
      }
			
		}
	} else {
    if (@available(iOS 13.0, *)) {
//      [self getNavigaitonBarStandardAppearance].backgroundColor =  nil;
//      [self getNavigaitonBarCompactAppearance].backgroundColor = nil;
//      [self getNavigaitonBarScrollEdgeAppearance].backgroundColor = nil;
    } else {
      
      UIView *transparentView = [self.navigationBar viewWithTag:TOP_BAR_TRANSPARENT_TAG];
      if (transparentView){
        [transparentView removeFromSuperview];
        [self.navigationBar setBackgroundImage:self.originalTopBarImages[@"backgroundImage"] ? self.originalTopBarImages[@"backgroundImage"] : [self.navigationBar backgroundImageForBarMetrics:UIBarMetricsDefault] forBarMetrics:UIBarMetricsDefault];
        self.navigationBar.shadowImage = self.originalTopBarImages[@"shadowImage"] ? self.originalTopBarImages[@"shadowImage"] : self.navigationBar.shadowImage;
        self.originalTopBarImages = nil;
      }
      
      self.navigationBar.barTintColor = nil;
    }
	}
}

- (void)storeOriginalTopBarImages:(UINavigationController *)navigationController {
	NSMutableDictionary *originalTopBarImages = [@{} mutableCopy];
	UIImage *bgImage = [navigationController.navigationBar backgroundImageForBarMetrics:UIBarMetricsDefault];
	if (bgImage != nil) {
		originalTopBarImages[@"backgroundImage"] = bgImage;
	}
	UIImage *shadowImage = navigationController.navigationBar.shadowImage;
	if (shadowImage != nil) {
		originalTopBarImages[@"shadowImage"] = shadowImage;
	}
	self.originalTopBarImages = originalTopBarImages;
}


@end
