#import "BitPortal-Swift.h"
#import "RNNRootViewController.h"
#import <React/RCTConvert.h>
#import "RNNAnimator.h"
#import "RNNPushAnimation.h"
#import "RNNReactView.h"
#import "RNNAnimationsTransitionDelegate.h"
#import "UIViewController+LayoutProtocol.h"

@implementation RNNRootViewController

@synthesize previewCallback;

- (instancetype)initWithLayoutInfo:(RNNLayoutInfo *)layoutInfo rootViewCreator:(id<RNNRootViewCreator>)creator eventEmitter:(RNNEventEmitter *)eventEmitter presenter:(RNNViewControllerPresenter *)presenter options:(RNNNavigationOptions *)options defaultOptions:(RNNNavigationOptions *)defaultOptions {
	self = [super initWithLayoutInfo:layoutInfo creator:creator options:options defaultOptions:defaultOptions presenter:presenter eventEmitter:eventEmitter childViewControllers:nil];
	
	self.animator = [[RNNAnimator alloc] initWithTransitionOptions:self.resolveOptions.customTransition];
	
	self.navigationController.delegate = self;
	
	return self;
}

- (instancetype)initExternalComponentWithLayoutInfo:(RNNLayoutInfo *)layoutInfo eventEmitter:(RNNEventEmitter *)eventEmitter presenter:(RNNViewControllerPresenter *)presenter options:(RNNNavigationOptions *)options defaultOptions:(RNNNavigationOptions *)defaultOptions {
	self = [self initWithLayoutInfo:layoutInfo rootViewCreator:nil eventEmitter:eventEmitter presenter:presenter options:options defaultOptions:defaultOptions];
	return self;
}

- (void)bindViewController:(UIViewController *)viewController {
	[self addChildViewController:viewController];
	[self.view addSubview:viewController.view];
	[viewController didMoveToParentViewController:self];
}

- (void)mergeOptions:(RNNNavigationOptions *)options {
	[_presenter mergeOptions:options currentOptions:self.options defaultOptions:self.defaultOptions];
	[((UIViewController<RNNLayoutProtocol> *)self.parentViewController) mergeOptions:options];
}

- (void)overrideOptions:(RNNNavigationOptions *)options {
	[self.options overrideOptions:options];
}

- (void)viewWillAppear:(BOOL)animated{
	[super viewWillAppear:animated];
	
	[_presenter applyOptions:self.resolveOptions];
	[_presenter renderComponents:self.resolveOptions perform:nil];
	
	[((UIViewController *)self.parentViewController) onChildWillAppear];
}

-(void)viewDidAppear:(BOOL)animated {
	[super viewDidAppear:animated];
	[self.eventEmitter sendComponentDidAppear:self.layoutInfo.componentId componentName:self.layoutInfo.name];
}

- (void)viewWillDisappear:(BOOL)animated {
	[super viewWillDisappear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
	[super viewDidDisappear:animated];
	[self.eventEmitter sendComponentDidDisappear:self.layoutInfo.componentId componentName:self.layoutInfo.name];
}

- (void)renderTreeAndWait:(BOOL)wait perform:(RNNReactViewReadyCompletionBlock)readyBlock {
	if (self.isExternalViewController) {
		if (readyBlock) {
			readyBlock();
		}
		return;
	}
	
	__block RNNReactViewReadyCompletionBlock readyBlockCopy = readyBlock;
	UIView* reactView = [self.creator createRootView:self.layoutInfo.name rootViewId:self.layoutInfo.componentId availableSize:[UIScreen mainScreen].bounds.size reactViewReadyBlock:^{
		[_presenter renderComponents:self.resolveOptions perform:^{
			if (readyBlockCopy) {
				readyBlockCopy();
				readyBlockCopy = nil;
			}
		}];
	}];
	
	self.view = reactView;
	
	if (!wait && readyBlock) {
		readyBlockCopy();
		readyBlockCopy = nil;
	}
}

- (UIViewController *)getCurrentChild {
	return nil;
}

-(void)updateSearchResultsForSearchController:(UISearchController *)searchController {
	[self.eventEmitter sendOnSearchBarUpdated:self.layoutInfo.componentId
										 text:searchController.searchBar.text
									isFocused:searchController.searchBar.isFirstResponder];
}

- (void)searchBarTextDidBeginEditing:(UISearchBar *)searchBar {
	if (self.resolveOptions.topBar.addressBar.hasValue) {
		[searchBar setShowsCancelButton:YES animated:YES];
	}
}

- (void)searchBarTextDidEndEditing:(UISearchBar *)searchBar {
	if (self.resolveOptions.topBar.addressBar.hasValue) {
		[searchBar setShowsCancelButton:NO animated:YES];
	}
}

- (void)searchBar:(UISearchBar *)searchBar textDidChange:(NSString *)searchText {
		if (self.resolveOptions.topBar.addressBar.hasValue) {
			[self.eventEmitter sendOnSearchBarUpdated:self.layoutInfo.componentId
												 text:searchText
											isFocused:searchBar.isFirstResponder];
		}
}

- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar {
	[self.eventEmitter sendOnSearchBarCancelPressed:self.layoutInfo.componentId];
	if (self.resolveOptions.topBar.addressBar.hasValue) {
		[searchBar setShowsCancelButton:NO animated:YES];
		[searchBar resignFirstResponder];
	}
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar {
	[self.eventEmitter sendOnSearchBarUpdated:self.layoutInfo.componentId
		text:searchBar.text
		isFocused:searchBar.isFirstResponder
		isSubmitting:YES];
	if (self.resolveOptions.topBar.addressBar.hasValue) {
		[searchBar setShowsCancelButton:NO animated:YES];
		[searchBar resignFirstResponder];
	}
}

-(BOOL)isCustomTransitioned {
	return self.resolveOptions.customTransition.animations != nil;
}

- (BOOL)isExternalViewController {
	return !self.creator;
}

- (BOOL)prefersStatusBarHidden {
	if (self.resolveOptions.statusBar.visible.hasValue) {
		return ![self.resolveOptions.statusBar.visible get];
	} else if ([self.resolveOptions.statusBar.hideWithTopBar getWithDefaultValue:NO]) {
		return self.navigationController.isNavigationBarHidden;
	}
	
	return NO;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
	if ([[self.resolveOptions.statusBar.style getWithDefaultValue:@"default"] isEqualToString:@"light"]) {
		return UIStatusBarStyleLightContent;
	} else {
		return UIStatusBarStyleDefault;
	}
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
	return self.resolveOptions.layout.supportedOrientations;
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated{
	RNNRootViewController* vc =  (RNNRootViewController*)viewController;
	if (![[vc.self.resolveOptions.topBar.backButton.transition getWithDefaultValue:@""] isEqualToString:@"custom"]){
		navigationController.delegate = nil;
	}
}

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
								  animationControllerForOperation:(UINavigationControllerOperation)operation
											   fromViewController:(UIViewController*)fromVC
												 toViewController:(UIViewController*)toVC {
	if (self.animator) {
		return self.animator;
	} else if (operation == UINavigationControllerOperationPush && self.resolveOptions.animations.push.hasCustomAnimation) {
		return [[RNNAnimationsTransitionDelegate alloc] initWithScreenTransition:self.resolveOptions.animations.push isDismiss:NO];
	} else if (operation == UINavigationControllerOperationPop && self.resolveOptions.animations.pop.hasCustomAnimation) {
		return [[RNNAnimationsTransitionDelegate alloc] initWithScreenTransition:self.resolveOptions.animations.pop isDismiss:YES];
	} else {
		return nil;
	}
	
	return nil;
}

- (UIViewController *)previewingContext:(id<UIViewControllerPreviewing>)previewingContext viewControllerForLocation:(CGPoint)location{
	return self.previewController;
}

- (void)previewingContext:(id<UIViewControllerPreviewing>)previewingContext commitViewController:(UIViewController *)viewControllerToCommit {
	if (self.previewCallback) {
		self.previewCallback(self);
	}
}

- (void)onActionPress:(NSString *)id {
	[_eventEmitter sendOnNavigationButtonPressed:self.layoutInfo.componentId buttonId:id];
}

- (UIPreviewAction *) convertAction:(NSDictionary *)action {
	NSString *actionId = action[@"id"];
	NSString *actionTitle = action[@"title"];
	UIPreviewActionStyle actionStyle = UIPreviewActionStyleDefault;
	if ([action[@"style"] isEqualToString:@"selected"]) {
		actionStyle = UIPreviewActionStyleSelected;
	} else if ([action[@"style"] isEqualToString:@"destructive"]) {
		actionStyle = UIPreviewActionStyleDestructive;
	}
	
	return [UIPreviewAction actionWithTitle:actionTitle style:actionStyle handler:^(UIPreviewAction * _Nonnull action, UIViewController * _Nonnull previewViewController) {
		[self onActionPress:actionId];
	}];
}

- (NSArray<id<UIPreviewActionItem>> *)previewActionItems {
	NSMutableArray *actions = [[NSMutableArray alloc] init];
	for (NSDictionary *previewAction in self.resolveOptions.preview.actions) {
		UIPreviewAction *action = [self convertAction:previewAction];
		NSDictionary *actionActions = previewAction[@"actions"];
		if (actionActions.count > 0) {
			NSMutableArray *group = [[NSMutableArray alloc] init];
			for (NSDictionary *previewGroupAction in actionActions) {
				[group addObject:[self convertAction:previewGroupAction]];
			}
			UIPreviewActionGroup *actionGroup = [UIPreviewActionGroup actionGroupWithTitle:action.title style:UIPreviewActionStyleDefault actions:group];
			[actions addObject:actionGroup];
		} else {
			[actions addObject:action];
		}
	}
	return actions;
}

-(void)onButtonPress:(RNNUIBarButtonItem *)barButtonItem {
	[self.eventEmitter sendOnNavigationButtonPressed:self.layoutInfo.componentId buttonId:barButtonItem.buttonId];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
	
}

@end
