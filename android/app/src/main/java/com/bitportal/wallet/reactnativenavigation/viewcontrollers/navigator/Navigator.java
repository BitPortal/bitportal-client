package com.reactnativenavigation.viewcontrollers.navigator;

import android.app.Activity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RestrictTo;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.reactnativenavigation.parse.Options;
import com.reactnativenavigation.presentation.OverlayManager;
import com.reactnativenavigation.presentation.Presenter;
import com.reactnativenavigation.react.EventEmitter;
import com.reactnativenavigation.utils.CommandListener;
import com.reactnativenavigation.utils.CommandListenerAdapter;
import com.reactnativenavigation.utils.CompatUtils;
import com.reactnativenavigation.utils.Functions.Func1;
import com.reactnativenavigation.viewcontrollers.ChildControllersRegistry;
import com.reactnativenavigation.viewcontrollers.ParentController;
import com.reactnativenavigation.viewcontrollers.ViewController;
import com.reactnativenavigation.viewcontrollers.modal.ModalStack;
import com.reactnativenavigation.viewcontrollers.stack.StackController;

import com.facebook.react.ReactInstanceManager;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class Navigator extends ParentController {

    private final ModalStack modalStack;
    private final OverlayManager overlayManager;
    private final RootPresenter rootPresenter;
    private ViewController root;
    private final FrameLayout rootLayout;
    private final FrameLayout modalsLayout;
    private final FrameLayout overlaysLayout;
    private ViewGroup contentLayout;
    private Options defaultOptions = new Options();

    @Override
    public void setDefaultOptions(Options defaultOptions) {
        super.setDefaultOptions(defaultOptions);
        this.defaultOptions = defaultOptions;
        modalStack.setDefaultOptions(defaultOptions);
    }

    public Options getDefaultOptions() {
        return defaultOptions;
    }

    public FrameLayout getRootLayout() {
        return rootLayout;
    }

    public void setEventEmitter(EventEmitter eventEmitter) {
        modalStack.setEventEmitter(eventEmitter);
    }

    public void setContentLayout(ViewGroup contentLayout) {
        this.contentLayout = contentLayout;
        contentLayout.addView(rootLayout);
        contentLayout.addView(modalsLayout);
        contentLayout.addView(overlaysLayout);
    }

    public Navigator(final Activity activity, ChildControllersRegistry childRegistry, ModalStack modalStack, OverlayManager overlayManager, RootPresenter rootPresenter) {
        super(activity, childRegistry,"navigator" + CompatUtils.generateViewId(), new Presenter(activity, new Options()), new Options());
        this.modalStack = modalStack;
        this.overlayManager = overlayManager;
        this.rootPresenter = rootPresenter;
        rootLayout = new FrameLayout(getActivity());
        modalsLayout = new FrameLayout(getActivity());
        overlaysLayout = new FrameLayout(getActivity());
    }

    public void bindViews() {
        modalStack.setModalsLayout(modalsLayout);
        modalStack.setRootLayout(rootLayout);
        rootPresenter.setRootContainer(rootLayout);
    }

    @NonNull
    @Override
    protected ViewGroup createView() {
        return rootLayout;
    }

    @NonNull
    @Override
    public Collection<ViewController> getChildControllers() {
        return root == null ? Collections.emptyList() : Collections.singletonList(root);
    }

    @Override
    public boolean handleBack(CommandListener listener) {
        if (modalStack.isEmpty() && root == null) return false;
        if (modalStack.isEmpty()) return root.handleBack(listener);
        return modalStack.handleBack(listener, root);
    }

    @Override
    protected ViewController getCurrentChild() {
        return root;
    }

    @Override
    public void destroy() {
        destroyViews();
        super.destroy();
    }

    public void destroyViews() {
        modalStack.destroy();
        overlayManager.destroy();
        destroyRoot();
    }

    private void destroyRoot() {
        if (root != null) root.destroy();
        root = null;
    }

    @Override
    public void sendOnNavigationButtonPressed(String buttonId) {

    }

    public void setRoot(final ViewController viewController, CommandListener commandListener, ReactInstanceManager reactInstanceManager) {
        destroyRoot();
        final boolean removeSplashView = isRootNotCreated();
        if (isRootNotCreated()) getView();
        root = viewController;
        rootPresenter.setRoot(root, defaultOptions, new CommandListenerAdapter(commandListener) {
            @Override
            public void onSuccess(String childId) {
                if (removeSplashView) removePreviousContentView();
                super.onSuccess(childId);
            }
        }, reactInstanceManager);
    }

    private void removePreviousContentView() {
        contentLayout.removeViewAt(0);
    }

    public void mergeOptions(final String componentId, Options options) {
        ViewController target = findController(componentId);
        if (target != null) {
            target.mergeOptions(options);
        }
    }

    public void push(final String id, final ViewController viewController, CommandListener listener) {
        applyOnStack(id, listener, stack -> stack.push(viewController, listener));
    }

    public void setStackRoot(String id, List<ViewController> children, CommandListener listener) {
        applyOnStack(id, listener, stack -> stack.setRoot(children, listener));
    }

    public void pop(String id, Options mergeOptions, CommandListener listener) {
        applyOnStack(id, listener, stack -> stack.pop(mergeOptions, listener));
    }

    public void popToRoot(final String id, Options mergeOptions, CommandListener listener) {
        applyOnStack(id, listener, stack -> stack.popToRoot(mergeOptions, listener));
    }

    public void popTo(final String id, Options mergeOptions, CommandListener listener) {
        ViewController target = findController(id);
        if (target != null) {
            target.performOnParentStack(stack -> ((StackController) stack).popTo(target, mergeOptions, listener));
        } else {
            listener.onError("Failed to execute stack command. Stack by " + id + " not found.");
        }
    }

    public void showModal(final ViewController viewController, CommandListener listener) {
        modalStack.showModal(viewController, root, listener);
    }

    public void dismissModal(final String componentId, CommandListener listener) {
        if (isRootNotCreated() && modalStack.size() == 1) {
            listener.onError("Can not dismiss modal if root is not set and only one modal is displayed.");
            return;
        }
        modalStack.dismissModal(componentId, root, listener);
    }

    public void dismissAllModals(Options mergeOptions, CommandListener listener) {
        modalStack.dismissAllModals(root, mergeOptions, listener);
    }

    public void showOverlay(ViewController overlay, CommandListener listener) {
        overlayManager.show(overlaysLayout, overlay, listener);
    }

    public void dismissOverlay(final String componentId, CommandListener listener) {
        overlayManager.dismiss(componentId, listener);
    }

    @Nullable
    @Override
    public ViewController findController(String id) {
        ViewController controllerById = super.findController(id);
        if (controllerById == null) {
            controllerById = modalStack.findControllerById(id);
        }
        if (controllerById == null) {
            controllerById = overlayManager.findControllerById(id);
        }
        return controllerById;
    }

    private void applyOnStack(String fromId, CommandListener listener, Func1<StackController> task) {
        ViewController from = findController(fromId);
        if (from != null) {
            if (from instanceof StackController) {
                task.run((StackController) from);
            } else {
                from.performOnParentStack(stack -> task.run((StackController) stack) );
            }
        } else {
            listener.onError("Failed to execute stack command. Stack " + fromId + " not found.");
        }
    }

    private boolean isRootNotCreated() {
        return view == null;
    }

    @RestrictTo(RestrictTo.Scope.TESTS)
    FrameLayout getModalsLayout() {
        return modalsLayout;
    }
}
