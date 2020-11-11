package com.bitportal.locales;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import java.util.Locale;
import android.content.Context;
public class LocalesInterface extends ReactContextBaseJavaModule {

	public LocalesInterface(ReactApplicationContext reactContext) {
		super(reactContext);
	}

	@Override
	public String getName() {
		return "LocalesInterface";
	}

	@ReactMethod
	public void getSystemLocales(Callback callback) {
		Context content = getReactApplicationContext();
		Locale locale = content.getResources().getConfiguration().locale;
		String language = locale.getLanguage();
		String local = Locale.getDefault().toString();
		String country = content.getResources().getConfiguration().locale.getCountry();

		if (language.indexOf("zh") != -1) {
			callback.invoke("zh_CN");
		}else if (language.indexOf("en") != -1) {
			callback.invoke("en");
		}else if (language.indexOf("ko") != -1) {
			callback.invoke("ko");
		}else {
			callback.invoke("en");
		}


	}
}
