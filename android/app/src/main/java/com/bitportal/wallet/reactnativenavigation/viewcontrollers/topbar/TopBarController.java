package com.reactnativenavigation.viewcontrollers.topbar;

import android.content.Context;
import androidx.viewpager.widget.ViewPager;
import android.view.View;

import com.reactnativenavigation.utils.CompatUtils;
import com.reactnativenavigation.views.StackLayout;
import com.reactnativenavigation.views.topbar.TopBar;


public class TopBarController {
    private TopBar topBar;

    public View createView(Context context, StackLayout stackLayout) {
        if (topBar == null) {
            topBar = createTopBar(context, stackLayout);
            topBar.setId(CompatUtils.generateViewId());
        }
        return topBar;
    }

    protected TopBar createTopBar(Context context, StackLayout stackLayout) {
        return new TopBar(context, stackLayout);
    }

    public TopBar getView() {
        return topBar;
    }

    public void initTopTabs(ViewPager viewPager) {
        topBar.initTopTabs(viewPager);
    }

    public void clearTopTabs() {
        topBar.clearTopTabs();
    }
}
