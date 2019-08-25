package com.bitportal.wallet;

import com.remobile.qrcodeLocalImage.RCTQRCodeLocalImagePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.apsl.versionnumber.RNVersionNumberPackage;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.bitportal.core.BPCorePackage;
import com.umeng.commonsdk.UMConfigure;
import com.bitportal.wallet.umeng.RNUMConfigure;
import com.bitportal.wallet.umeng.DplusReactPackage;
import com.bitportal.wallet.nativeutils.NativeUtilsPackage;
import com.bitportal.wallet.qrcode.QRScanReaderPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import cn.jpush.android.api.JPushInterface;
import com.rnfs.RNFSPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  // 设置为 true 将不会弹出 toast
  private boolean SHUTDOWN_TOAST = false;
  // 设置为 true 将不会打印 log
  private boolean SHUTDOWN_LOG = false;

  @Override
  protected ReactGateway createReactGateway() {
      ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
          @Override
          protected String getJSMainModuleName() {
              return "index";
          }
      };
      return new ReactGateway(this, isDebug(), host);
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
      new LinearGradientPackage(),
      new ReactNativeConfigPackage(),
      new RandomBytesPackage(),
      new RNSensitiveInfoPackage(),
      new RNCameraPackage(),
      new RNVersionNumberPackage(),
      new RNDeviceInfo(),
      new PickerPackage(),
      new RCTQRCodeLocalImagePackage(),
      new DplusReactPackage(),
      new NativeUtilsPackage(),
      new QRScanReaderPackage(),
      new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
      new FastImageViewPackage(),
      new RNFSPackage(),
      new AsyncStoragePackage(),
      new ReanimatedPackage(),
      new RNGestureHandlerPackage(),
      new RNCViewPagerPackage(),
      new ReactSliderPackage(),
      new RNCWebViewPackage()
    );
  }

  @Override
  public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);
      UMConfigure.setLogEnabled(false);
      RNUMConfigure.init(this, "5b46d7f1f43e482296000178", "android channel", UMConfigure.DEVICE_TYPE_PHONE, null);
      JPushInterface.setDebugMode(true);
      JPushInterface.init(this);
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  public String getFileProviderAuthority() {
    return BuildConfig.APPLICATION_ID + ".provider";
  }
}
