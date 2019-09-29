#import "UINavigationController+RNNOptions.h"
#import "RNNFontAttributesCreator.h"
#import "UIImage+tint.h"

const NSInteger BLUR_TOPBAR_TAG = 78264802;

@implementation UINavigationController (RNNOptions)

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

- (void)rnn_setInteractivePopGestureEnabled:(BOOL)enabled {
  if (@available(iOS 13.0, *)) {
    
  } else {
    self.interactivePopGestureRecognizer.enabled = enabled;
  }
}

- (void)rnn_setRootBackgroundImage:(UIImage *)backgroundImage {
  if (@available(iOS 13.0, *)) {
    
  } else {
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

- (void)rnn_setNavigationBarTestID:(NSString *)testID {
	self.navigationBar.accessibilityIdentifier = testID;
}

- (void)rnn_setNavigationBarVisible:(BOOL)visible animated:(BOOL)animated {
  [self setNavigationBarHidden:!visible animated:animated];
}

- (void)rnn_hideBarsOnScroll:(BOOL)hideOnScroll {
  if (@available(iOS 13.0, *)) {
    
  } else {
    self.hidesBarsOnSwipe = hideOnScroll;
  }
}

- (void)rnn_setNavigationBarNoBorder:(BOOL)noBorder {
	if (noBorder) {
    if (@available(iOS 13.0, *)) {
//      [self getNavigaitonBarStandardAppearance].shadowImage =  [[UIImage alloc] init];
//      [self getNavigaitonBarCompactAppearance].shadowImage = [[UIImage alloc] init];
//      [self getNavigaitonBarScrollEdgeAppearance].shadowImage = [[UIImage alloc] init];
//
//      [self getNavigaitonBarStandardAppearance].shadowColor =  [UIColor clearColor];
//      [self getNavigaitonBarCompactAppearance].shadowColor = [UIColor clearColor];
//      [self getNavigaitonBarScrollEdgeAppearance].shadowColor = [UIColor clearColor];
    } else {
      [self.navigationBar setShadowImage:[[UIImage alloc] init]];
    }
	} else {
    if (@available(iOS 13.0, *)) {
//      [self getNavigaitonBarStandardAppearance].shadowImage =  nil;
//      [self getNavigaitonBarCompactAppearance].shadowImage = nil;
//      [self getNavigaitonBarScrollEdgeAppearance].shadowImage = nil;
//
//      UIColor* defaultShadowColor = [UINavigationBarAppearance new].shadowColor;
//      [self getNavigaitonBarStandardAppearance].shadowColor =  defaultShadowColor;
//      [self getNavigaitonBarCompactAppearance].shadowColor = defaultShadowColor;
//      [self getNavigaitonBarScrollEdgeAppearance].shadowColor = defaultShadowColor;
    } else {
      [self.navigationBar setShadowImage:nil];
    }
	}
}

- (void)rnn_setBarStyle:(UIBarStyle)barStyle {
  if (@available(iOS 13.0, *)) {
    
  } else {
    self.navigationBar.barStyle = barStyle;
  }
}

- (void)rnn_setNavigationBarFontFamily:(NSString *)fontFamily fontSize:(NSNumber *)fontSize color:(UIColor *)color {
  if (@available(iOS 13.0, *)) {
//    NSDictionary* fontAttributes = [RNNFontAttributesCreator createFontAttributesWithFontFamily:fontFamily fontSize:fontSize color:[UIColor labelColor]];
//    if (fontAttributes.allKeys.count > 0) {
//      [self getNavigaitonBarStandardAppearance].titleTextAttributes =  fontAttributes;
//      [self getNavigaitonBarCompactAppearance].titleTextAttributes = fontAttributes;
//      [self getNavigaitonBarScrollEdgeAppearance].titleTextAttributes = fontAttributes;
//    }
  } else {
    NSDictionary* fontAttributes = [RNNFontAttributesCreator createFontAttributesWithFontFamily:fontFamily fontSize:fontSize color:color];
    
    if (fontAttributes.allKeys.count > 0) {
      self.navigationBar.titleTextAttributes = fontAttributes;
    }
  }
}

- (void)rnn_setNavigationBarLargeTitleVisible:(BOOL)visible API_AVAILABLE(ios(11.0)) {
  if (@available(iOS 13.0, *)) {
    self.navigationBar.prefersLargeTitles = YES;
  } else {
    if (@available(iOS 11.0, *)) {
      if (visible) {
        self.navigationBar.prefersLargeTitles = YES;
      } else {
        self.navigationBar.prefersLargeTitles = NO;
      }
    }
  }
}

- (void)rnn_setNavigationBarLargeTitleFontFamily:(NSString *)fontFamily fontSize:(NSNumber *)fontSize color:(UIColor *)color API_AVAILABLE(ios(11.0)) {
	if (@available(iOS 11.0, *)) {
    if (@available(iOS 13.0, *)) {
//      NSDictionary* fontAttributes = [RNNFontAttributesCreator createFontAttributesWithFontFamily:fontFamily fontSize:fontSize color:[UIColor labelColor]];
//      self.navigationBar.largeTitleTextAttributes = fontAttributes;
//      [self getNavigaitonBarStandardAppearance].largeTitleTextAttributes =  fontAttributes;
//      [self getNavigaitonBarCompactAppearance].largeTitleTextAttributes = fontAttributes;
//      [self getNavigaitonBarScrollEdgeAppearance].largeTitleTextAttributes = fontAttributes;
    } else {
      NSDictionary* fontAttributes = [RNNFontAttributesCreator createFontAttributesWithFontFamily:fontFamily fontSize:fontSize color:color];
      self.navigationBar.largeTitleTextAttributes = fontAttributes;
    }
	}
}

- (void)rnn_setNavigationBarTranslucent:(BOOL)translucent {
  if (@available(iOS 13.0, *)) {
    
  } else {
    self.navigationBar.translucent = translucent;
  }
}

- (void)rnn_setNavigationBarBlur:(BOOL)blur {
  if (@available(iOS 13.0, *)) {
    
  } else {
    if (blur && ![self.navigationBar viewWithTag:BLUR_TOPBAR_TAG]) {
      [self.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
      self.navigationBar.shadowImage = [UIImage new];
      UIVisualEffectView *blur = [[UIVisualEffectView alloc] initWithEffect:[UIBlurEffect effectWithStyle:UIBlurEffectStyleLight]];
      CGRect statusBarFrame = [[UIApplication sharedApplication] statusBarFrame];
      blur.frame = CGRectMake(0, -1 * statusBarFrame.size.height, self.navigationBar.frame.size.width, self.navigationBar.frame.size.height + statusBarFrame.size.height);
      blur.userInteractionEnabled = NO;
      blur.tag = BLUR_TOPBAR_TAG;
      [self.navigationBar insertSubview:blur atIndex:0];
      [self.navigationBar sendSubviewToBack:blur];
    } else {
      UIView *blur = [self.navigationBar viewWithTag:BLUR_TOPBAR_TAG];
      if (blur) {
        [self.navigationBar setBackgroundImage: nil forBarMetrics:UIBarMetricsDefault];
        self.navigationBar.shadowImage = nil;
        [blur removeFromSuperview];
      }
    }
  }
}

- (void)rnn_setBackButtonIcon:(UIImage *)icon withColor:(UIColor *)color title:(NSString *)title {
  if (@available(iOS 13.0, *)) {
    
  } else {
    UIBarButtonItem *backItem = [[UIBarButtonItem alloc] init];
    if (icon) {
      backItem.image = color
      ? [[icon withTintColor:color] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal]
      : icon;
      
      [self.navigationBar setBackIndicatorImage:[UIImage new]];
      [self.navigationBar setBackIndicatorTransitionMaskImage:[UIImage new]];
    }
    
    UIViewController *lastViewControllerInStack = self.viewControllers.count > 1 ? [self.viewControllers objectAtIndex:self.viewControllers.count-2] : self.topViewController;
    
    backItem.title = title ? title : lastViewControllerInStack.navigationItem.title;
    backItem.tintColor = color;
    
    lastViewControllerInStack.navigationItem.backBarButtonItem = backItem;
  }
}

- (void)rnn_setBackButtonColor:(UIColor *)color {
  if (@available(iOS 13.0, *)) {
    
  } else {
    self.navigationBar.tintColor = color;
  }
}

- (void)rnn_setNavigationBarClipsToBounds:(BOOL)clipsToBounds {
  if (@available(iOS 13.0, *)) {
    
  } else {
    self.navigationBar.clipsToBounds = clipsToBounds;
  }
}

@end
