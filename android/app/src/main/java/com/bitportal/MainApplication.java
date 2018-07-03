package com.bitportal;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.facebook.react.ReactNativeHost;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.cmcewen.blurview.BlurViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.bitportal.core.BPCorePackage;

import java.util.Arrays;
import java.util.List;
import java.util.Vector;

public class MainApplication extends NavigationApplication {
  @Override
  protected ReactNativeHost createReactNativeHost() {
      return new NavigationReactNativeHost(this) {
          @Override
          protected String getJSMainModuleName() {
              return "index";
          }
      };
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new BPCorePackage(),
      new SvgPackage(),
      new SplashScreenReactPackage(),
      new VectorIconsPackage(),
      new MPAndroidChartPackage(),
      new LinearGradientPackage(),
      new ReactNativeConfigPackage(),
      new RandomBytesPackage(),
      new RNSensitiveInfoPackage(),
      new RNCameraPackage(),
      new BlurViewPackage(),
      new RNVersionNumberPackage(),
      new RNDeviceInfo(),
      new ReactNativeRestartPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
}
