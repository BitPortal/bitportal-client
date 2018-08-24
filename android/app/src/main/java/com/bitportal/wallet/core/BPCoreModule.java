package com.bitportal.wallet.core;

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
            String reply = cppApi.pbkdf2(password, salt, iterations, (byte) keylen, digest);
            Log.d("pbkdf2", String.format("reply = %s", reply));
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject("Err", e);
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
            String reply = cppApi.scrypt(password, salt, N, (byte) r, (byte) p, (byte) dkLen);
            Log.d("scrypt", String.format("reply = %s", reply));
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject("Err", e);
        }
    }
}
