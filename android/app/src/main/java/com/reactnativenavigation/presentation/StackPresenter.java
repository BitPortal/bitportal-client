package com.reactnativenavigation.presentation;

import android.app.Activity;
import android.graphics.Color;
import androidx.annotation.Nullable;
import androidx.annotation.RestrictTo;
import androidx.appcompat.widget.Toolbar;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.view.ViewGroup.MarginLayoutParams;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.reactnativenavigation.parse.Alignment;
import com.reactnativenavigation.parse.AnimationsOptions;
import com.reactnativenavigation.parse.Options;
import com.reactnativenavigation.parse.OrientationOptions;
import com.reactnativenavigation.parse.TopBarButtons;
import com.reactnativenavigation.parse.TopBarOptions;
import com.reactnativenavigation.parse.TopTabOptions;
import com.reactnativenavigation.parse.TopTabsOptions;
import com.reactnativenavigation.parse.params.Button;
import com.reactnativenavigation.parse.params.Colour;
import com.reactnativenavigation.utils.ButtonPresenter;
import com.reactnativenavigation.utils.ImageLoader;
import com.reactnativenavigation.utils.ObjectUtils;
import com.reactnativenavigation.utils.UiUtils;
import com.reactnativenavigation.viewcontrollers.IReactView;
import com.reactnativenavigation.viewcontrollers.ReactViewCreator;
import com.reactnativenavigation.viewcontrollers.TitleBarButtonController;
import com.reactnativenavigation.viewcontrollers.TitleBarReactViewController;
import com.reactnativenavigation.viewcontrollers.ViewController;
import com.reactnativenavigation.viewcontrollers.button.NavigationIconResolver;
import com.reactnativenavigation.viewcontrollers.topbar.TopBarBackgroundViewController;
import com.reactnativenavigation.views.Component;
import com.reactnativenavigation.views.titlebar.TitleBarReactViewCreator;
import com.reactnativenavigation.views.topbar.TopBar;
import com.reactnativenavigation.views.topbar.TopBarBackgroundViewCreator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.reactnativenavigation.utils.CollectionUtils.*;
import static com.reactnativenavigation.utils.ObjectUtils.perform;

public class StackPresenter {
    private static final int DEFAULT_TITLE_COLOR = Color.BLACK;
    private static final int DEFAULT_SUBTITLE_COLOR = Color.GRAY;
    private static final int DEFAULT_BORDER_COLOR = Color.BLACK;
    private static final double DEFAULT_ELEVATION = 4d;
    private final double defaultTitleFontSize;
    private final double defaultSubtitleFontSize;
    private final Activity activity;

    private TopBar topBar;
    private final TitleBarReactViewCreator titleViewCreator;
    private TitleBarButtonController.OnClickListener onClickListener;
    private final ImageLoader imageLoader;
    private final RenderChecker renderChecker;
    private final TopBarBackgroundViewCreator topBarBackgroundViewCreator;
    private final ReactViewCreator buttonCreator;
    private Options defaultOptions;
    private Map<Component, TitleBarReactViewController> titleControllers = new HashMap();
    private Map<Component, TopBarBackgroundViewController> backgroundControllers = new HashMap();
    private Map<Component, Map<String, TitleBarButtonController>> componentRightButtons = new HashMap();
    private Map<Component, Map<String, TitleBarButtonController>> componentLeftButtons = new HashMap();

    public StackPresenter(Activity activity,
                          TitleBarReactViewCreator titleViewCreator,
                          TopBarBackgroundViewCreator topBarBackgroundViewCreator,
                          ReactViewCreator buttonCreator,
                          ImageLoader imageLoader,
                          RenderChecker renderChecker,
                          Options defaultOptions) {
        this.activity = activity;
        this.titleViewCreator = titleViewCreator;
        this.topBarBackgroundViewCreator = topBarBackgroundViewCreator;
        this.buttonCreator = buttonCreator;
        this.imageLoader = imageLoader;
        this.renderChecker = renderChecker;
        this.defaultOptions = defaultOptions;
        defaultTitleFontSize = UiUtils.dpToSp(activity, 18);
        defaultSubtitleFontSize = UiUtils.dpToSp(activity, 14);
    }

    public void setDefaultOptions(Options defaultOptions) {
        this.defaultOptions = defaultOptions;
    }

    public void setButtonOnClickListener(TitleBarButtonController.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public Options getDefaultOptions() {
        return defaultOptions;
    }

    public void bindView(TopBar topBar) {
        this.topBar = topBar;
    }

    public boolean isRendered(Component component) {
        ArrayList<ViewController> controllers = new ArrayList<>(perform(componentRightButtons.get(component), new ArrayList<>(), Map::values));
        controllers.add(backgroundControllers.get(component));
        controllers.add(titleControllers.get(component));
        return renderChecker.areRendered(filter(controllers, ObjectUtils::notNull));
    }

    public void applyLayoutParamsOptions(Options options, View view) {
        Options withDefault = options.copy().withDefaultOptions(defaultOptions);
        if (view instanceof Component) {
            if (withDefault.topBar.drawBehind.isTrue() && !withDefault.layout.topMargin.hasValue()) {
                ((Component) view).drawBehindTopBar();
            } else if (options.topBar.drawBehind.isFalseOrUndefined()) {
                ((Component) view).drawBelowTopBar(topBar);
            }
        }
    }

    public void mergeOptions(Options options, Component currentChild) {
        mergeOrientation(options.layout.orientation);
//        mergeButtons(topBar, withDefault.topBar.buttons, child);
        mergeTopBarOptions(options.topBar, options.animations, currentChild);
        mergeTopTabsOptions(options.topTabs);
        mergeTopTabOptions(options.topTabOptions);
    }

    public void applyInitialChildLayoutOptions(Options options) {
        Options withDefault = options.copy().withDefaultOptions(defaultOptions);
        setInitialTopBarVisibility(withDefault.topBar);
    }

    public void applyChildOptions(Options options, Component child) {
        Options withDefault = options.copy().withDefaultOptions(defaultOptions);
        applyOrientation(withDefault.layout.orientation);
        applyButtons(withDefault.topBar, child);
        applyTopBarOptions(withDefault.topBar, withDefault.animations, child, options);
        applyTopTabsOptions(withDefault.topTabs);
        applyTopTabOptions(withDefault.topTabOptions);
    }

    public void applyOrientation(OrientationOptions options) {
        OrientationOptions withDefaultOptions = options.copy().mergeWithDefault(defaultOptions.layout.orientation);
        ((Activity) topBar.getContext()).setRequestedOrientation(withDefaultOptions.getValue());
    }

    public void onChildDestroyed(Component child) {
        perform(titleControllers.remove(child), TitleBarReactViewController::destroy);
        perform(backgroundControllers.remove(child), TopBarBackgroundViewController::destroy);
        destroyButtons(componentRightButtons.get(child));
        destroyButtons(componentLeftButtons.get(child));
        componentRightButtons.remove(child);
        componentLeftButtons.remove(child);
    }

    private void destroyButtons(@Nullable Map<String, TitleBarButtonController> buttons) {
        if (buttons != null) forEach(buttons.values(), ViewController::destroy);
    }

    private void applyTopBarOptions(TopBarOptions options, AnimationsOptions animationOptions, Component component, Options componentOptions) {
        topBar.setHeight(options.height.get(UiUtils.getTopBarHeightDp(activity)));
        topBar.setElevation(options.elevation.get(DEFAULT_ELEVATION));
        if (topBar.getLayoutParams() instanceof MarginLayoutParams) {
            ((MarginLayoutParams) topBar.getLayoutParams()).topMargin = UiUtils.dpToPx(activity, options.topMargin.get(0));
        }

        topBar.setTitleHeight(options.title.height.get(UiUtils.getTopBarHeightDp(activity)));
        topBar.setTitle(options.title.text.get(""));
        topBar.setTitleTopMargin(options.title.topMargin.get(0));

        if (options.title.component.hasValue()) {
            if (titleControllers.containsKey(component)) {
                topBar.setTitleComponent(titleControllers.get(component).getView());
            } else {
                TitleBarReactViewController controller = new TitleBarReactViewController(activity, titleViewCreator);
                controller.setWaitForRender(options.title.component.waitForRender);
                titleControllers.put(component, controller);
                controller.setComponent(options.title.component);
                controller.getView().setLayoutParams(getComponentLayoutParams(options.title.component));
                topBar.setTitleComponent(controller.getView());
            }
        }

        topBar.setTitleFontSize(options.title.fontSize.get(defaultTitleFontSize));
        topBar.setTitleTextColor(options.title.color.get(DEFAULT_TITLE_COLOR));
        topBar.setTitleTypeface(options.title.fontFamily);
        topBar.setTitleAlignment(options.title.alignment);

        topBar.setSubtitle(options.subtitle.text.get(""));
        topBar.setSubtitleFontSize(options.subtitle.fontSize.get(defaultSubtitleFontSize));
        topBar.setSubtitleColor(options.subtitle.color.get(DEFAULT_SUBTITLE_COLOR));
        topBar.setSubtitleFontFamily(options.subtitle.fontFamily);
        topBar.setSubtitleAlignment(options.subtitle.alignment);

        topBar.setBorderHeight(options.borderHeight.get(0d));
        topBar.setBorderColor(options.borderColor.get(DEFAULT_BORDER_COLOR));

        topBar.setBackgroundColor(options.background.color.get(Color.WHITE));

        if (options.background.component.hasValue()) {
            View createdComponent = findBackgroundComponent(options.background.component);
            if (createdComponent != null) {
                topBar.setBackgroundComponent(createdComponent);
            } else {
                TopBarBackgroundViewController controller = new TopBarBackgroundViewController(activity, topBarBackgroundViewCreator);
                controller.setWaitForRender(options.background.waitForRender);
                backgroundControllers.put(component, controller);
                controller.setComponent(options.background.component);
                controller.getView().setLayoutParams(new RelativeLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
                topBar.setBackgroundComponent(controller.getView());
            }
        } else {
            topBar.clearBackgroundComponent();
        }

        if (options.testId.hasValue()) topBar.setTestId(options.testId.get());
        applyTopBarVisibility(options, animationOptions, componentOptions);
        if (options.drawBehind.isTrue() && !componentOptions.layout.topMargin.hasValue()) {
            component.drawBehindTopBar();
        } else if (options.drawBehind.isFalseOrUndefined()) {
            component.drawBelowTopBar(topBar);
        }
        if (options.hideOnScroll.isTrue()) {
            if (component instanceof IReactView) {
                topBar.enableCollapse(((IReactView) component).getScrollEventListener());
            }
        } else if (options.hideOnScroll.isFalseOrUndefined()) {
            topBar.disableCollapse();
        }
    }

    @Nullable
    private View findBackgroundComponent(com.reactnativenavigation.parse.Component component) {
        for (TopBarBackgroundViewController controller : backgroundControllers.values()) {
            if (ObjectUtils.equalsNotNull(controller.getComponent().name.get(null), component.name.get(null)) &&
                ObjectUtils.equalsNotNull(controller.getComponent().componentId.get(null), component.componentId.get(null))) {
                return controller.getView();
            }
        }
        return null;
    }

    private void setInitialTopBarVisibility(TopBarOptions options) {
        if (options.visible.isFalse()) {
            topBar.hide();
        }
        if (options.visible.isTrueOrUndefined()) {
            topBar.show();
        }
    }

    private void applyTopBarVisibility(TopBarOptions options, AnimationsOptions animationOptions, Options componentOptions) {
        if (options.visible.isFalse()) {
            if (options.animate.isTrueOrUndefined() && componentOptions.animations.push.enabled.isTrueOrUndefined()) {
                topBar.hideAnimate(animationOptions.pop.topBar);
            } else {
                topBar.hide();
            }
        }
        if (options.visible.isTrueOrUndefined()) {
            if (options.animate.isTrueOrUndefined() && componentOptions.animations.push.enabled.isTrueOrUndefined()) {
                topBar.showAnimate(animationOptions.push.topBar);
            } else {
                topBar.show();
            }
        }
    }

    private void applyButtons(TopBarOptions options, Component child) {
        List<Button> rightButtons = mergeButtonsWithColor(options.buttons.right, options.rightButtonColor, options.rightButtonDisabledColor);
        List<Button> leftButtons = mergeButtonsWithColor(options.buttons.left, options.leftButtonColor, options.leftButtonDisabledColor);

        if (rightButtons != null) {
            List<TitleBarButtonController> rightButtonControllers = getOrCreateButtonControllers(componentRightButtons.get(child), rightButtons);
            componentRightButtons.put(child, keyBy(rightButtonControllers, TitleBarButtonController::getButtonInstanceId));
            topBar.setRightButtons(rightButtonControllers);
        } else {
            topBar.clearRightButtons();
        }

        if (leftButtons != null) {
            List<TitleBarButtonController> leftButtonControllers = getOrCreateButtonControllers(componentLeftButtons.get(child), leftButtons);
            componentLeftButtons.put(child, keyBy(leftButtonControllers, TitleBarButtonController::getButtonInstanceId));
            topBar.setLeftButtons(leftButtonControllers);
        } else {
            topBar.clearLeftButtons();
        }

        if (options.buttons.back.visible.isTrue() && !options.buttons.hasLeftButtons()) {
            topBar.setBackButton(createButtonController(options.buttons.back));
        }

        topBar.setOverflowButtonColor(options.rightButtonColor.get(Color.BLACK));
    }

    private List<TitleBarButtonController> getOrCreateButtonControllers(@Nullable Map<String, TitleBarButtonController> currentButtons, @Nullable List<Button> buttons) {
        if (buttons == null) return null;
        Map<String, TitleBarButtonController> result = new LinkedHashMap<>();
        for (Button b : buttons) {
            result.put(b.instanceId, currentButtons != null && currentButtons.containsKey(b.instanceId) ? currentButtons.get(b.instanceId) : createButtonController(b));
        }
        return new ArrayList<>(result.values());
    }

    private TitleBarButtonController createButtonController(Button button) {
        TitleBarButtonController controller = new TitleBarButtonController(activity,
                new NavigationIconResolver(activity, imageLoader),
                imageLoader,
                new ButtonPresenter(topBar.getTitleBar(), button),
                button,
                buttonCreator,
                onClickListener
        );
        controller.setWaitForRender(button.component.waitForRender);
        return controller;
    }

    private void applyTopTabsOptions(TopTabsOptions options) {
        topBar.applyTopTabsColors(options.selectedTabColor, options.unselectedTabColor);
        topBar.applyTopTabsFontSize(options.fontSize);
        topBar.setTopTabsVisible(options.visible.isTrueOrUndefined());
        topBar.setTopTabsHeight(options.height.get(LayoutParams.WRAP_CONTENT));
    }

    private void applyTopTabOptions(TopTabOptions topTabOptions) {
        if (topTabOptions.fontFamily != null) topBar.setTopTabFontFamily(topTabOptions.tabIndex, topTabOptions.fontFamily);
    }

    public void onChildWillAppear(Options appearing, Options disappearing) {
        if (disappearing.topBar.visible.isTrueOrUndefined() && appearing.topBar.visible.isFalse()) {
            if (disappearing.topBar.animate.isTrueOrUndefined() && disappearing.animations.pop.enabled.isTrueOrUndefined()) {
                topBar.hideAnimate(disappearing.animations.pop.topBar);
            } else {
                topBar.hide();
            }
        }
    }

    public void mergeChildOptions(Options toMerge, Options resolvedOptions, Component child) {
        TopBarOptions topBar = toMerge.copy().mergeWith(resolvedOptions).withDefaultOptions(defaultOptions).topBar;
        mergeOrientation(toMerge.layout.orientation);
        mergeButtons(topBar, toMerge.topBar.buttons, child);
        mergeTopBarOptions(toMerge.topBar, toMerge.animations, child);
        mergeTopTabsOptions(toMerge.topTabs);
        mergeTopTabOptions(toMerge.topTabOptions);
    }

    private void mergeOrientation(OrientationOptions orientationOptions) {
        if (orientationOptions.hasValue()) applyOrientation(orientationOptions);
    }

    private void mergeButtons(TopBarOptions options, TopBarButtons buttons, Component child) {
        List<Button> rightButtons = mergeButtonsWithColor(buttons.right, options.rightButtonColor, options.rightButtonDisabledColor);
        List<Button> leftButtons = mergeButtonsWithColor(buttons.left, options.leftButtonColor, options.leftButtonDisabledColor);

        List<TitleBarButtonController> rightButtonControllers = getOrCreateButtonControllers(componentRightButtons.get(child), rightButtons);
        List<TitleBarButtonController> leftButtonControllers = getOrCreateButtonControllers(componentLeftButtons.get(child), leftButtons);

        if (rightButtonControllers != null) {
            Map previousRightButtons = componentRightButtons.put(child, keyBy(rightButtonControllers, TitleBarButtonController::getButtonInstanceId));
            if (previousRightButtons != null) forEach(previousRightButtons.values(), TitleBarButtonController::destroy);
        }
        if (leftButtonControllers != null) {
            Map previousLeftButtons = componentLeftButtons.put(child, keyBy(leftButtonControllers, TitleBarButtonController::getButtonInstanceId));
            if (previousLeftButtons != null) forEach(previousLeftButtons.values(), TitleBarButtonController::destroy);
        }

        if (buttons.right != null) topBar.setRightButtons(rightButtonControllers);
        if (buttons.left != null) topBar.setLeftButtons(leftButtonControllers);
        if (buttons.back.hasValue()) topBar.setBackButton(createButtonController(buttons.back));

        if (options.rightButtonColor.hasValue()) topBar.setOverflowButtonColor(options.rightButtonColor.get());
    }

    @Nullable
    private List<Button> mergeButtonsWithColor(List<Button> buttons, Colour buttonColor, Colour disabledColor) {
        List<Button> result = null;
        if (buttons != null) {
            result = new ArrayList<>();
            for (Button button : buttons) {
                Button copy = button.copy();
                if (!button.color.hasValue()) copy.color = buttonColor;
                if (!button.disabledColor.hasValue()) copy.disabledColor = disabledColor;
                result.add(copy);
            }
        }
        return result;
    }

    private void mergeTopBarOptions(TopBarOptions options, AnimationsOptions animationsOptions, Component component) {
        if (options.height.hasValue()) topBar.setHeight(options.height.get());
        if (options.elevation.hasValue()) topBar.setElevation(options.elevation.get());
        if (options.topMargin.hasValue() && topBar.getLayoutParams() instanceof MarginLayoutParams) {
            ((MarginLayoutParams) topBar.getLayoutParams()).topMargin = UiUtils.dpToPx(activity, options.topMargin.get());
        }

        if (options.title.height.hasValue()) topBar.setTitleHeight(options.title.height.get());
        if (options.title.text.hasValue()) topBar.setTitle(options.title.text.get());
        if (options.title.topMargin.hasValue()) topBar.setTitleTopMargin(options.title.topMargin.get());

        if (options.title.component.hasValue()) {
            if (titleControllers.containsKey(component)) {
                topBar.setTitleComponent(titleControllers.get(component).getView());
            } else {
                TitleBarReactViewController controller = new TitleBarReactViewController(activity, titleViewCreator);
                titleControllers.put(component, controller);
                controller.setComponent(options.title.component);
                controller.getView().setLayoutParams(getComponentLayoutParams(options.title.component));
                topBar.setTitleComponent(controller.getView());
            }
        }

        if (options.title.color.hasValue()) topBar.setTitleTextColor(options.title.color.get());
        if (options.title.fontSize.hasValue()) topBar.setTitleFontSize(options.title.fontSize.get());
        if (options.title.fontFamily != null) topBar.setTitleTypeface(options.title.fontFamily);

        if (options.subtitle.text.hasValue()) topBar.setSubtitle(options.subtitle.text.get());
        if (options.subtitle.color.hasValue()) topBar.setSubtitleColor(options.subtitle.color.get());
        if (options.subtitle.fontSize.hasValue()) topBar.setSubtitleFontSize(options.subtitle.fontSize.get());
        if (options.subtitle.fontFamily != null) topBar.setSubtitleFontFamily(options.subtitle.fontFamily);

        if (options.background.color.hasValue()) topBar.setBackgroundColor(options.background.color.get());

        if (options.background.component.hasValue()) {
            if (backgroundControllers.containsKey(component)) {
                topBar.setBackgroundComponent(backgroundControllers.get(component).getView());
            } else {
                TopBarBackgroundViewController controller = new TopBarBackgroundViewController(activity, topBarBackgroundViewCreator);
                backgroundControllers.put(component, controller);
                controller.setComponent(options.background.component);
                controller.getView().setLayoutParams(new RelativeLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
                topBar.setBackgroundComponent(controller.getView());
            }
        }

        if (options.testId.hasValue()) topBar.setTestId(options.testId.get());

        if (options.visible.isFalse()) {
            if (options.animate.isTrueOrUndefined()) {
                topBar.hideAnimate(animationsOptions.pop.topBar);
            } else {
                topBar.hide();
            }
        }
        if (options.visible.isTrue()) {
            if (options.animate.isTrueOrUndefined()) {
                topBar.showAnimate(animationsOptions.push.topBar);
            } else {
                topBar.show();
            }
        }
        if (options.drawBehind.isTrue()) {
            component.drawBehindTopBar();
        }
        if (options.drawBehind.isFalse()) {
            component.drawBelowTopBar(topBar);
        }
        if (options.hideOnScroll.isTrue() && component instanceof IReactView) {
            topBar.enableCollapse(((IReactView) component).getScrollEventListener());
        }
        if (options.hideOnScroll.isFalse()) {
            topBar.disableCollapse();
        }
    }

    private void mergeTopTabsOptions(TopTabsOptions options) {
        if (options.selectedTabColor.hasValue() && options.unselectedTabColor.hasValue()) topBar.applyTopTabsColors(options.selectedTabColor, options.unselectedTabColor);
        if (options.fontSize.hasValue()) topBar.applyTopTabsFontSize(options.fontSize);
        if (options.visible.hasValue()) topBar.setTopTabsVisible(options.visible.isTrue());
        if (options.height.hasValue()) topBar.setTopTabsHeight(options.height.get(LayoutParams.WRAP_CONTENT));
    }

    private void mergeTopTabOptions(TopTabOptions topTabOptions) {
        if (topTabOptions.fontFamily != null) topBar.setTopTabFontFamily(topTabOptions.tabIndex, topTabOptions.fontFamily);
    }

    private LayoutParams getComponentLayoutParams(com.reactnativenavigation.parse.Component component) {
        return new Toolbar.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT, component.alignment == Alignment.Center ? Gravity.CENTER : Gravity.START);
    }

    @RestrictTo(RestrictTo.Scope.TESTS)
    public Map<Component, TitleBarReactViewController> getTitleComponents() {
        return titleControllers;
    }

    @RestrictTo(RestrictTo.Scope.TESTS)
    public Map<Component, TopBarBackgroundViewController> getBackgroundComponents() {
        return backgroundControllers;
    }

    @RestrictTo(RestrictTo.Scope.TESTS)
    public List<TitleBarButtonController> getComponentButtons(Component child) {
        return merge(getRightButtons(child), getLeftButtons(child), Collections.EMPTY_LIST);
    }

    @RestrictTo(RestrictTo.Scope.TESTS)
    public List<TitleBarButtonController> getComponentButtons(Component child, List<TitleBarButtonController> defaultValue) {
        return merge(getRightButtons(child), getLeftButtons(child), defaultValue);
    }

    private List<TitleBarButtonController> getRightButtons(Component child) {
        return componentRightButtons.containsKey(child) ? new ArrayList<>(componentRightButtons.get(child).values()) : null;
    }

    private List<TitleBarButtonController> getLeftButtons(Component child) {
        return componentLeftButtons.containsKey(child) ? new ArrayList<>(componentLeftButtons.get(child).values()) : null;
    }
}
