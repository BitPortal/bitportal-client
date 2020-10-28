package com.reactnativenavigation.views.topbar;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.RestrictTo;
import androidx.annotation.VisibleForTesting;
import com.google.android.material.appbar.AppBarLayout;
import androidx.viewpager.widget.ViewPager;
import androidx.appcompat.widget.Toolbar;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.SearchView;

import com.bitportal.wallet.BuildConfig;
import com.bitportal.wallet.R;
import com.reactnativenavigation.anim.TopBarAnimator;
import com.reactnativenavigation.anim.TopBarCollapseBehavior;
import com.reactnativenavigation.interfaces.ScrollEventListener;
import com.reactnativenavigation.parse.Alignment;
import com.reactnativenavigation.parse.AnimationOptions;
import com.reactnativenavigation.parse.params.Colour;
import com.reactnativenavigation.parse.params.Number;
import com.reactnativenavigation.utils.CompatUtils;
import com.reactnativenavigation.utils.UiUtils;
import com.reactnativenavigation.viewcontrollers.TitleBarButtonController;
import com.reactnativenavigation.views.StackLayout;
import com.reactnativenavigation.views.titlebar.TitleBar;
import com.reactnativenavigation.views.toptabs.TopTabs;

import java.util.Collections;
import java.util.List;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

@SuppressLint("ViewConstructor")
public class TopBar extends AppBarLayout implements ScrollEventListener.ScrollAwareView {
    private TitleBar titleBar;
    private final TopBarCollapseBehavior collapsingBehavior;
    private TopBarAnimator animator;
    private TopTabs topTabs;
    private FrameLayout root;
    private View border;
    private View component;
    private float elevation = -1;

    public TopBar(final Context context, StackLayout parentView) {
        super(context);
        context.setTheme(R.style.TopBar);
        collapsingBehavior = new TopBarCollapseBehavior(this);
        topTabs = new TopTabs(getContext());
        animator = new TopBarAnimator(this, parentView.getStackId());
        createLayout();
    }

    private void createLayout() {
        setId(CompatUtils.generateViewId());
        titleBar = createTitleBar(getContext());
        topTabs = createTopTabs();
        border = createBorder();
        LinearLayout content = createContentLayout();

        root = new FrameLayout(getContext());
        root.setId(CompatUtils.generateViewId());
        content.addView(titleBar, MATCH_PARENT, UiUtils.getTopBarHeight(getContext()));
        content.addView(topTabs);
        root.addView(content);
        root.addView(border);
        addView(root, MATCH_PARENT, WRAP_CONTENT);
    }

    private LinearLayout createContentLayout() {
        LinearLayout content = new LinearLayout(getContext());
        content.setOrientation(VERTICAL);
        return content;
    }

    // private SearchView createSearchView() {
    //     SearchView searchView = new LinearLayout(getContext());
    //     return searchView;
    // }

    @NonNull
    private TopTabs createTopTabs() {
        RelativeLayout.LayoutParams lp = new RelativeLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT);
        lp.addRule(RelativeLayout.BELOW, titleBar.getId());
        TopTabs topTabs = new TopTabs(getContext());
        topTabs.setLayoutParams(lp);
        topTabs.setVisibility(GONE);
        return topTabs;
    }

    private View createBorder() {
        View border = new View(getContext());
        border.setBackgroundColor(Color.TRANSPARENT);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(MATCH_PARENT, 0);
        lp.gravity = Gravity.BOTTOM;
        border.setLayoutParams(lp);
        return border;
    }

    protected TitleBar createTitleBar(Context context) {
        TitleBar titleBar = new TitleBar(context);
        titleBar.setId(CompatUtils.generateViewId());
        return titleBar;
    }

    public void setHeight(int height) {
        int pixelHeight = UiUtils.dpToPx(getContext(), height);
        if (pixelHeight == getLayoutParams().height) return;
        ViewGroup.LayoutParams lp = getLayoutParams();
        lp.height = pixelHeight;
        setLayoutParams(lp);
    }

    public void setTitleHeight(int height) {
        titleBar.setHeight(height);
    }

    public void setTitleTopMargin(int topMargin) {
        titleBar.setTopMargin(topMargin);
    }

    public void setTitle(String title) {
        titleBar.setTitle(title);
    }

    public String getTitle() {
        return titleBar.getTitle();
    }

    public void setSubtitle(String subtitle) {
        titleBar.setSubtitle(subtitle);
    }

    public void setSubtitleColor(@ColorInt int color) {
        titleBar.setSubtitleTextColor(color);
    }

    public void setSubtitleFontFamily(Typeface fontFamily) {
        titleBar.setSubtitleTypeface(fontFamily);
    }

    public void setSubtitleFontSize(double size) {
        titleBar.setSubtitleFontSize(size);
    }

    public void setSubtitleAlignment(Alignment alignment) {
        titleBar.setSubtitleAlignment(alignment);
    }

    public void setTestId(String testId) {
        setTag(testId);
    }

    public void setTitleTextColor(@ColorInt int color) {
        titleBar.setTitleTextColor(color);
    }

    public void setTitleFontSize(double size) {
        titleBar.setTitleFontSize(size);
    }

    public void setTitleTypeface(Typeface typeface) {
        titleBar.setTitleTypeface(typeface);
    }

    public void setTitleAlignment(Alignment alignment) {
        titleBar.setTitleAlignment(alignment);
    }

    public void setTitleComponent(View component) {
        titleBar.setComponent(component);
    }

    public void setBackgroundComponent(View component) {
        if (this.component == component || component.getParent() != null) return;
        this.component = component;
        root.addView(component, 0);
    }

    public void setTopTabFontFamily(int tabIndex, Typeface fontFamily) {
        topTabs.setFontFamily(tabIndex, fontFamily);
    }

    public void applyTopTabsColors(Colour selectedTabColor, Colour unselectedTabColor) {
        topTabs.applyTopTabsColors(selectedTabColor, unselectedTabColor);
    }

    public void applyTopTabsFontSize(Number fontSize) {
        topTabs.applyTopTabsFontSize(fontSize);
    }

    public void setTopTabsVisible(boolean visible) {
        topTabs.setVisibility(this, visible);
    }

    public void setTopTabsHeight(int height) {
        if (topTabs.getLayoutParams().height == height) return;
        topTabs.getLayoutParams().height = height > 0 ? UiUtils.dpToPx(getContext(), height) : height;
        topTabs.setLayoutParams(topTabs.getLayoutParams());
    }

    public void setBackButton(TitleBarButtonController backButton) {
        titleBar.setBackButton(backButton);
    }

    public void setLeftButtons(List<TitleBarButtonController> leftButtons) {
        titleBar.setLeftButtons(leftButtons);
    }

    public void clearLeftButtons() {
        titleBar.setLeftButtons(Collections.emptyList());
    }

    public void setRightButtons(List<TitleBarButtonController> rightButtons) {
        titleBar.setRightButtons(rightButtons);
    }

    public void clearRightButtons() {
        titleBar.setRightButtons(Collections.emptyList());
    }

    public void setElevation(Double elevation) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && getElevation() != elevation.floatValue()) {
            this.elevation = UiUtils.dpToPx(getContext(), elevation.floatValue());
            setElevation(this.elevation);
        }
    }

    @Override
    public void setElevation(float elevation) {
        if (elevation == this.elevation) super.setElevation(elevation);
    }

    public Toolbar getTitleBar() {
        return titleBar;
    }

    public void initTopTabs(ViewPager viewPager) {
        topTabs.setVisibility(VISIBLE);
        topTabs.init(viewPager);
    }

    public void enableCollapse(ScrollEventListener scrollEventListener) {
        collapsingBehavior.enableCollapse(scrollEventListener);
    }

    public void disableCollapse() {
        collapsingBehavior.disableCollapse();
    }

    public void show() {
        if (visible() || animator.isAnimatingShow()) return;
        resetAnimationOptions();
        setVisibility(View.VISIBLE);
    }

    private boolean visible() {
        return getVisibility() == View.VISIBLE;
    }

    public void showAnimate(AnimationOptions options) {
        if (visible() || animator.isAnimatingShow()) return;
        animator.show(options);
    }

    public void hide() {
        if (!animator.isAnimatingHide()) {
            setVisibility(View.GONE);
        }
    }

    public void hideAnimate(AnimationOptions options) {
        hideAnimate(options, () -> {});
    }

    public void hideAnimate(AnimationOptions options, Runnable onAnimationEnd) {
        if (!visible()) return;
        animator.hide(options, onAnimationEnd);
    }

    public void clearBackgroundComponent() {
        if (component != null) {
            root.removeView(component);
            component = null;
        }
    }

    public void clearTopTabs() {
        topTabs.clear();
    }

    @VisibleForTesting
    public TopTabs getTopTabs() {
        return topTabs;
    }

    @VisibleForTesting
    public void setAnimator(TopBarAnimator animator) {
        this.animator = animator;
    }

    @RestrictTo(RestrictTo.Scope.TESTS)
    public TextView getTitleTextView() {
        return titleBar.findTitleTextView();
    }

    public void resetAnimationOptions() {
        setTranslationY(0);
        setTranslationX(0);
        setAlpha(1);
        setScaleY(1);
        setScaleX(1);
        setRotationX(0);
        setRotationY(0);
        setRotation(0);
    }

    public void setBorderHeight(double height) {
        border.getLayoutParams().height = (int) UiUtils.dpToPx(getContext(), (float) height);
    }

    public void setBorderColor(int color) {
        border.setBackgroundColor(color);
    }

    public void setOverflowButtonColor(int color) {
        titleBar.setOverflowButtonColor(color);
    }
}
