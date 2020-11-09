package com.reactnativenavigation.views;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.reactnativenavigation.interfaces.ScrollEventListener;
import com.reactnativenavigation.parse.Options;
import com.reactnativenavigation.parse.params.Bool;
import com.reactnativenavigation.utils.ViewUtils;
import com.reactnativenavigation.viewcontrollers.IReactView;
import com.reactnativenavigation.viewcontrollers.TitleBarButtonController;
import com.reactnativenavigation.views.element.Element;
import com.reactnativenavigation.views.topbar.TopBar;
import com.reactnativenavigation.views.touch.OverlayTouchDelegate;

import java.util.List;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

@SuppressLint("ViewConstructor")
public class ComponentLayout extends FrameLayout implements ReactComponent, TitleBarButtonController.OnClickListener {

    private IReactView reactView;
    private final OverlayTouchDelegate touchDelegate;

    public ComponentLayout(Context context, IReactView reactView) {
		super(context);
		this.reactView = reactView;
        addView(reactView.asView(), MATCH_PARENT, MATCH_PARENT);
        touchDelegate = new OverlayTouchDelegate(reactView);
    }

    @Override
    public boolean isReady() {
        return reactView.isReady();
    }

    @Override
    public View asView() {
        return this;
    }

    @Override
    public void destroy() {
        reactView.destroy();
    }

	@Override
	public void sendComponentStart() {
		reactView.sendComponentStart();
	}

	@Override
	public void sendComponentStop() {
		reactView.sendComponentStop();
	}

    public void applyOptions(Options options) {
        touchDelegate.setInterceptTouchOutside(options.overlayOptions.interceptTouchOutside);
    }

    public void setInterceptTouchOutside(Bool interceptTouchOutside) {
        touchDelegate.setInterceptTouchOutside(interceptTouchOutside);
    }

    @Override
    public void sendOnNavigationButtonPressed(String buttonId) {
        reactView.sendOnNavigationButtonPressed(buttonId);
    }

    @Override
    public ScrollEventListener getScrollEventListener() {
        return reactView.getScrollEventListener();
    }

    @Override
    public void dispatchTouchEventToJs(MotionEvent event) {
        reactView.dispatchTouchEventToJs(event);
    }

    @Override
    public void drawBehindTopBar() {
        if (getLayoutParams() instanceof RelativeLayout.LayoutParams) {
            RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) getLayoutParams();
            layoutParams.topMargin = 0;
            setLayoutParams(layoutParams);
        }
    }

    @Override
    public void drawBelowTopBar(TopBar topBar) {
        if (getLayoutParams() instanceof RelativeLayout.LayoutParams) {
            RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) getLayoutParams();
            layoutParams.topMargin = ViewUtils.getHeight(topBar);
            try {
                setLayoutParams(layoutParams);
            } catch (IllegalStateException ignored) { }
        }
    }

    @Override
    public boolean isRendered() {
        return reactView.isRendered();
    }

    @Override
    public List<Element> getElements() {
        return reactView.getElements();
    }

    @Override
    public void onPress(String buttonId) {
        reactView.sendOnNavigationButtonPressed(buttonId);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        return touchDelegate.onInterceptTouchEvent(ev);
    }
}
