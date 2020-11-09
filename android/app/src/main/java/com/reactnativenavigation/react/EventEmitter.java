package com.reactnativenavigation.react;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

import static com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

public class EventEmitter {
    private static final String AppLaunched = "RNN.AppLaunched";
    private static final String CommandCompleted = "RNN.CommandCompleted";
    private static final String BottomTabSelected = "RNN.BottomTabSelected";
    private static final String ComponentDidAppear = "RNN.ComponentDidAppear";
    private static final String ComponentDidDisappear = "RNN.ComponentDidDisappear";
    private static final String NavigationButtonPressed = "RNN.NavigationButtonPressed";
    private static final String ModalDismissed = "RNN.ModalDismissed";
    @Nullable
    private ReactContext reactContext;

    public EventEmitter(@Nullable ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    public void appLaunched() {
        emit(AppLaunched);
    }

    public void emitComponentDidDisappear(String id, String componentName) {
        WritableMap event = Arguments.createMap();
        event.putString("componentId", id);
        event.putString("componentName", componentName);
        emit(ComponentDidDisappear, event);
    }

    public void emitComponentDidAppear(String id, String componentName) {
        WritableMap event = Arguments.createMap();
        event.putString("componentId", id);
        event.putString("componentName", componentName);
        emit(ComponentDidAppear, event);
    }

    public void emitOnNavigationButtonPressed(String id, String buttonId) {
        WritableMap event = Arguments.createMap();
        event.putString("componentId", id);
        event.putString("buttonId", buttonId);
        emit(NavigationButtonPressed, event);
    }

    public void emitBottomTabSelected(int unselectedTabIndex, int selectedTabIndex) {
        WritableMap event = Arguments.createMap();
        event.putInt("unselectedTabIndex", unselectedTabIndex);
        event.putInt("selectedTabIndex", selectedTabIndex);
        emit(BottomTabSelected, event);
    }

    public void emitCommandCompleted(String commandId, long completionTime) {
        WritableMap event = Arguments.createMap();
        event.putString("commandId", commandId);
        event.putDouble("completionTime", completionTime);
        emit(CommandCompleted, event);
    }

    public void emitModalDismissed(String id, int modalsDismissed) {
        WritableMap event = Arguments.createMap();
        event.putString("componentId", id);
        event.putInt("modalsDismissed", modalsDismissed);
        emit(ModalDismissed, event);
    }

    private void emit(String eventName) {
        emit(eventName, Arguments.createMap());
    }

    private void emit(String eventName, WritableMap data) {
        if (reactContext == null) {
            Log.e("RNN", "Could not send event " + eventName + ". React context is null!");
            return;
        }
        RCTDeviceEventEmitter emitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        emitter.emit(eventName, data);
    }
}
