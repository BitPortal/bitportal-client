// AUTOGENERATED FILE - DO NOT MODIFY!
// This file generated by Djinni from core.djinni

package com.bitportal.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

public abstract class Core {
    public abstract String pbkdf2(String password, String salt, int iterations, byte keylen, String digest);

    public abstract String scrypt(String password, String salt, int N, byte r, byte p, byte dkLen);

    public abstract ArrayList<HashMap<String, String>> scanHDBTCAddresses(String xpub, int startIndex, int endIndex, boolean isSegWit);

    public static Core create()
    {
        return CppProxy.create();
    }

    private static final class CppProxy extends Core
    {
        private final long nativeRef;
        private final AtomicBoolean destroyed = new AtomicBoolean(false);

        private CppProxy(long nativeRef)
        {
            if (nativeRef == 0) throw new RuntimeException("nativeRef is zero");
            this.nativeRef = nativeRef;
        }

        private native void nativeDestroy(long nativeRef);
        public void _djinni_private_destroy()
        {
            boolean destroyed = this.destroyed.getAndSet(true);
            if (!destroyed) nativeDestroy(this.nativeRef);
        }
        protected void finalize() throws java.lang.Throwable
        {
            _djinni_private_destroy();
            super.finalize();
        }

        @Override
        public String pbkdf2(String password, String salt, int iterations, byte keylen, String digest)
        {
            assert !this.destroyed.get() : "trying to use a destroyed object";
            return native_pbkdf2(this.nativeRef, password, salt, iterations, keylen, digest);
        }
        private native String native_pbkdf2(long _nativeRef, String password, String salt, int iterations, byte keylen, String digest);

        @Override
        public String scrypt(String password, String salt, int N, byte r, byte p, byte dkLen)
        {
            assert !this.destroyed.get() : "trying to use a destroyed object";
            return native_scrypt(this.nativeRef, password, salt, N, r, p, dkLen);
        }
        private native String native_scrypt(long _nativeRef, String password, String salt, int N, byte r, byte p, byte dkLen);

        @Override
        public ArrayList<HashMap<String, String>> scanHDBTCAddresses(String xpub, int startIndex, int endIndex, boolean isSegWit)
        {
            assert !this.destroyed.get() : "trying to use a destroyed object";
            return native_scanHDBTCAddresses(this.nativeRef, xpub, startIndex, endIndex, isSegWit);
        }
        private native ArrayList<HashMap<String, String>> native_scanHDBTCAddresses(long _nativeRef, String xpub, int startIndex, int endIndex, boolean isSegWit);

        public static native Core create();
    }
}
