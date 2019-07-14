package com.bitportal.core;

import java.util.ArrayList;
import java.util.HashMap;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
            String result = cppApi.pbkdf2(password, salt, iterations, (byte) keylen, digest);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("pbkdf2 error", e);
        }
    }

    @ReactMethod
    public void scrypt(
        String password,
        String salt,
        int N,
        int r,
        int p,
        int dkLen,
        Promise promise) {
        try {
            String result = cppApi.scrypt(password, salt, N, (byte) r, (byte) p, (byte) dkLen);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("scrypt error", e);
        }
    }

    @ReactMethod
    public void scanHDBTCAddresses(
        String xpub,
        int startIndex,
        int endIndex,
        boolean isSegWit,
        Promise promise) {
        try {
            ArrayList<HashMap<String, String>> result = cppApi.scanHDBTCAddresses(xpub, startIndex, endIndex, isSegWit);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("scanHDBTCAddresses error", e);
        }
    }
}
