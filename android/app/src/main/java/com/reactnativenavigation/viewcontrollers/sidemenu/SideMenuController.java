package com.reactnativenavigation.viewcontrollers.sidemenu;

import android.app.Activity;
import android.content.res.Resources;
import androidx.annotation.NonNull;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.drawerlayout.widget.DrawerLayout.LayoutParams;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;

import com.reactnativenavigation.parse.Options;
import com.reactnativenavigation.parse.SideMenuOptions;
import com.reactnativenavigation.parse.params.Bool;
import com.reactnativenavigation.presentation.Presenter;
import com.reactnativenavigation.presentation.SideMenuPresenter;
import com.reactnativenavigation.utils.CommandListener;
import com.reactnativenavigation.viewcontrollers.ChildControllersRegistry;
import com.reactnativenavigation.viewcontrollers.ParentController;
import com.reactnativenavigation.viewcontrollers.ViewController;
import com.reactnativenavigation.views.*;

import java.util.ArrayList;
import java.util.Collection;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

public class SideMenuController extends ParentController<DrawerLayout> implements DrawerLayout.DrawerListener {

	private ViewController center;
	private ViewController left;
	private ViewController right;
    private SideMenuPresenter presenter;
    private float prevLeftSlideOffset = 0;
    private float prevRightSlideOffset = 0;

    public SideMenuController(Activity activity, ChildControllersRegistry childRegistry, String id, Options initialOptions, SideMenuPresenter sideMenuOptionsPresenter, Presenter presenter) {
		super(activity, childRegistry, id, presenter, initialOptions);
        this.presenter = sideMenuOptionsPresenter;
    }

    @Override
    protected ViewController getCurrentChild() {
	    if (getView().isDrawerOpen(Gravity.LEFT)) {
            return left;
        } else if (getView().isDrawerOpen(Gravity.RIGHT)) {
            return right;
        }
        return center;
    }

    @NonNull
	@Override
	protected DrawerLayout createView() {
        DrawerLayout sideMenu = new SideMenu(getActivity());
        presenter.bindView(sideMenu);
        sideMenu.addDrawerListener(this);
        return sideMenu;
	}

    @Override
    public void sendOnNavigationButtonPressed(String buttonId) {
        center.sendOnNavigationButtonPressed(buttonId);
    }

    @NonNull
	@Override
	public Collection<ViewController> getChildControllers() {
		ArrayList<ViewController> children = new ArrayList<>();
		if (center != null) children.add(center);
		if (left != null) children.add(left);
		if (right != null) children.add(right);
		return children;
	}

    @Override
    public void applyChildOptions(Options options, Component child) {
        super.applyChildOptions(options, child);
        presenter.applyChildOptions(resolveCurrentOptions());
        performOnParentController(parentController ->
                ((ParentController) parentController).applyChildOptions(this.options, child)
        );
    }

    @Override
    public void mergeChildOptions(Options options, ViewController childController, Component child) {
        super.mergeChildOptions(options, childController, child);
        presenter.mergeChildOptions(options.sideMenuRootOptions);
        performOnParentController(parentController ->
                ((ParentController) parentController).mergeChildOptions(options.copy().clearSideMenuOptions(), childController, child)
        );
    }

    @Override
    public void mergeOptions(Options options) {
        super.mergeOptions(options);
        presenter.mergeOptions(options.sideMenuRootOptions);
    }

    @Override
    public Options resolveCurrentOptions() {
        Options options = super.resolveCurrentOptions();
        if (getView().isDrawerOpen(Gravity.LEFT) || getView().isDrawerOpen(Gravity.RIGHT)) {
            options = options.mergeWith(center.resolveCurrentOptions());
        }
        return options;
    }

    //For onDrawerOpened and onDrawerClosed :
    //Merge the options to the current state, if this happened due to a gesture we need to
    //update the option state

    @Override
    public void onDrawerOpened(@NonNull View drawerView) {
        ViewController view = this.getMatchingView(drawerView);
        view.mergeOptions(this.getOptionsWithVisibility(this.viewIsLeft(drawerView), true));
    }

    @Override
    public void onDrawerClosed(@NonNull View drawerView) {
        ViewController view = this.getMatchingView(drawerView);
        view.mergeOptions(this.getOptionsWithVisibility(this.viewIsLeft(drawerView), false));
    }

    @Override
    public void onDrawerSlide(@NonNull View drawerView, float slideOffset) {
        int gravity = getSideMenuGravity(drawerView);
        if (gravity == Gravity.LEFT) {
            dispatchSideMenuVisibilityEvents(left, prevLeftSlideOffset, slideOffset);
            prevLeftSlideOffset = slideOffset;
        } else if (gravity == Gravity.RIGHT) {
            dispatchSideMenuVisibilityEvents(right, prevRightSlideOffset, slideOffset);
            prevRightSlideOffset = slideOffset;
        }
    }

    @Override
    public void onDrawerStateChanged(int newState) {

    }

    @Override
    public boolean handleBack(CommandListener listener) {
        return presenter.handleBack() || center.handleBack(listener) || super.handleBack(listener);
    }

    public void setCenterController(ViewController centerController) {
		this.center = centerController;
		View childView = centerController.getView();
		getView().addView(childView);
	}

    public void setLeftController(ViewController controller) {
        this.left = controller;
        int height = getHeight(options.sideMenuRootOptions.left);
        int width = getWidth(options.sideMenuRootOptions.left);
        getView().addView(controller.getView(), new LayoutParams(width, height, Gravity.LEFT));
    }

    public void setRightController(ViewController controller) {
        this.right = controller;
        int height = getHeight(options.sideMenuRootOptions.right);
        int width = getWidth(options.sideMenuRootOptions.right);
        getView().addView(controller.getView(), new LayoutParams(width, height, Gravity.RIGHT));
    }

    private int getWidth(SideMenuOptions sideMenuOptions) {
        int width = MATCH_PARENT;
        if (sideMenuOptions.width.hasValue()) {
            width = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, sideMenuOptions.width.get(), Resources.getSystem().getDisplayMetrics());
        }
        return width;
    }

    private int getHeight(SideMenuOptions sideMenuOptions) {
        int height = MATCH_PARENT;
        if (sideMenuOptions.height.hasValue()) {
            height = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, sideMenuOptions.height.get(), Resources.getSystem().getDisplayMetrics());
        }
        return height;
    }

    private ViewController getMatchingView (View drawerView) {
        return this.viewIsLeft(drawerView) ? left : right;
    }

    private boolean viewIsLeft (View drawerView) {
        return (left != null && drawerView.equals(left.getView()));
    }

    private int getSideMenuGravity(View drawerView) {
        return ((LayoutParams) drawerView.getLayoutParams()).gravity;
    }

    private Options getOptionsWithVisibility(boolean isLeft, boolean visible ) {
        Options options = new Options();
        if (isLeft) {
            options.sideMenuRootOptions.left.visible = new Bool(visible);
        } else {
            options.sideMenuRootOptions.right.visible = new Bool(visible);
        }
        return options;
    }

    private void dispatchSideMenuVisibilityEvents(ViewController drawer, float prevOffset, float offset) {
        if (prevOffset == 0 && offset> 0) {
            drawer.onViewAppeared();
        } else if (prevOffset > 0 && offset == 0) {
            drawer.onViewDisappear();
        }
    }
}
