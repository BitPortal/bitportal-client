package com.bitportal.core;

import android.util.Log;
import android.os.Bundle;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class BPCoreModule extends ReactContextBaseJavaModule {
    private Core cppApi;

    //this loads the library when the class is loaded
    static {
        System.loadLibrary("core");
    }

    private final ReactApplicationContext reactContext;

    public BPCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        cppApi = Core.create();
    }

    @Override
    public String getName() {
        return "BPCoreModule";
    }

    @ReactMethod
    public void pbkdf2(
            String password,
            String salt,
            int iterations,
            int keylen,
            String digest,
            Promise promise) {
        try {
            String reply = cppApi.pbkdf2(password, salt, iterations, (byte) keylen, digest);
            Log.d("pbkdf2", String.format("reply = %s", reply));
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject("Err", e);
        }
    }
}
