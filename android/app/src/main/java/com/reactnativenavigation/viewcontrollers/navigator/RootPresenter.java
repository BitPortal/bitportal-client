package com.reactnativenavigation.viewcontrollers.navigator;

import android.content.Context;
import android.widget.FrameLayout;
import android.view.View;

import com.reactnativenavigation.anim.NavigationAnimator;
import com.reactnativenavigation.parse.Options;
import com.reactnativenavigation.utils.CommandListener;
import com.reactnativenavigation.viewcontrollers.ViewController;
import com.reactnativenavigation.views.element.ElementTransitionManager;

import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.ReactInstanceManager;

public class RootPresenter {
    private NavigationAnimator animator;
    private FrameLayout rootLayout;

    void setRootContainer(FrameLayout rootLayout) {
        this.rootLayout = rootLayout;
    }

    public RootPresenter(Context context) {
        animator = new NavigationAnimator(context, new ElementTransitionManager());
    }

    RootPresenter(NavigationAnimator animator) {
        this.animator = animator;
    }

    void setRoot(ViewController root, Options defaultOptions, CommandListener listener, ReactInstanceManager reactInstanceManager) {
        setLayoutDirection(root, defaultOptions, (ReactApplicationContext) reactInstanceManager.getCurrentReactContext());
        rootLayout.addView(root.getView());
        Options options = root.resolveCurrentOptions(defaultOptions);
        root.setWaitForRender(options.animations.setRoot.waitForRender);
        if (options.animations.setRoot.waitForRender.isTrue()) {
            root.getView().setAlpha(0);
            root.addOnAppearedListener(() -> {
                root.getView().setAlpha(1);
                animateSetRootAndReportSuccess(root, listener, options);
            });
        } else {
            animateSetRootAndReportSuccess(root, listener, options);
        }
    }

    private void animateSetRootAndReportSuccess(ViewController root, CommandListener listener, Options options) {
        if (options.animations.setRoot.hasAnimation()) {
            animator.setRoot(root.getView(), options.animations.setRoot, () -> listener.onSuccess(root.getId()));
        } else {
            listener.onSuccess(root.getId());
        }
    }

    private void setLayoutDirection(ViewController root, Options defaultOptions, ReactApplicationContext reactContext) {
        if (defaultOptions.layout.direction.hasValue()) {
            I18nUtil i18nUtil = I18nUtil.getInstance();
            Boolean isRtl = defaultOptions.layout.direction.get().equals("rtl");

            root.getActivity().getWindow().getDecorView().setLayoutDirection(isRtl ? View.LAYOUT_DIRECTION_RTL : View.LAYOUT_DIRECTION_LTR);
            i18nUtil.allowRTL(reactContext, isRtl);
            i18nUtil.forceRTL(reactContext, isRtl);
        }
    }
}
