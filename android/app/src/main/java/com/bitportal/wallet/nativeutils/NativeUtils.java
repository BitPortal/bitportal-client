package com.bitportal.wallet.nativeutils;

import android.content.Context;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;

import cn.jpush.android.api.JPushInterface;


public class NativeUtils extends ReactContextBaseJavaModule {

    private Context context;

    public static final String REACT_CLASS = "NativeUtils";

    public NativeUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context=reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void goSettingPermission() {

        Activity mActivity = getCurrentActivity();

        Intent localIntent = new Intent();
        localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= 9) {
            localIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            localIntent.setData(Uri.fromParts("package", mActivity.getPackageName(), null));
        } else if (Build.VERSION.SDK_INT <= 8) {
            localIntent.setAction(Intent.ACTION_VIEW);
            localIntent.setClassName("com.android.settings", "com.android.settings.InstalledAppDetails");
            localIntent.putExtra("com.android.settings.ApplicationPkgName", mActivity.getPackageName());
        }
        mActivity.startActivity(localIntent);
    }

    @ReactMethod
    public void getRegistrationID(Promise promise){
        try {
            WritableMap map = Arguments.createMap();
            map.putString("registrationID", JPushInterface.getRegistrationID(context));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
        }

    }

}
