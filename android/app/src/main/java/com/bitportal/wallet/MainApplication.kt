package com.bitportal.wallet

import android.app.Application
import android.util.Log
import com.bitportal.wallet.reactnative.ReactNativeModule
// import com.facebook.react.PackageList
import com.facebook.react.ReactPackage
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import java.util.HashMap
import com.bitportal.wallet.materialDialog.MaterialDialogPackage
import com.reactnativecommunity.webview.RNCWebViewPackage
import com.reactnativecommunity.slider.ReactSliderPackage
import com.reactnativecommunity.viewpager.RNCViewPagerPackage
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage
import com.swmansion.reanimated.ReanimatedPackage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage
import com.rnfs.RNFSPackage
import com.dylanvann.fastimage.FastImageViewPackage
import com.bitportal.wallet.qrcode.QRScanReaderPackage
import com.bitportal.wallet.nativeutils.NativeUtilsPackage
import com.bitportal.wallet.umeng.DplusReactPackage
import com.remobile.qrcodeLocalImage.RCTQRCodeLocalImagePackage
import com.reactnative.ivpusic.imagepicker.PickerPackage
import com.learnium.RNDeviceInfo.RNDeviceInfo
import com.apsl.versionnumber.RNVersionNumberPackage
import org.reactnative.camera.RNCameraPackage
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage
import com.bitgo.randombytes.RandomBytesPackage
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage
import com.BV.LinearGradient.LinearGradientPackage
import com.oblador.vectoricons.VectorIconsPackage
import org.devio.rn.splashscreen.SplashScreenReactPackage
import com.horcrux.svg.SvgPackage
import com.bitportal.core.BPCorePackage
import java.util.Arrays
import com.facebook.soloader.SoLoader
import com.facebook.react.shell.MainReactPackage
import com.bitportal.wallet.MarketViewPackage

class MainApplication : Application(), ReactApplication {
  private val reactNativeHost = object : ReactNativeHost(this) {
    override fun getJSMainModuleName(): String {
      return "index"
    }

    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
    override fun getPackages(): List<ReactPackage> =
      Arrays.asList(
        MainReactPackage(),
        BPCorePackage (),
        SvgPackage (),
        SplashScreenReactPackage (),
        VectorIconsPackage (),
        LinearGradientPackage (),
        ReactNativeConfigPackage (),
        RandomBytesPackage (),
        RNSensitiveInfoPackage (),
        RNCameraPackage (),
        RNVersionNumberPackage (),
        RNDeviceInfo (),
        PickerPackage (),
        RCTQRCodeLocalImagePackage (),
        DplusReactPackage (),
        NativeUtilsPackage (),
        QRScanReaderPackage (),
        FastImageViewPackage (),
        RNFSPackage (),
        AsyncStoragePackage (),
        ReanimatedPackage (),
        RNGestureHandlerPackage (),
        RNCViewPagerPackage (),
        ReactSliderPackage (),
        RNCWebViewPackage (),
        MaterialDialogPackage (),
        MarketViewPackage()
      )
  }

  // override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost
  override fun getReactNativeHost(): ReactNativeHost {
    return ReactNativeModule.shared.reactNativeHost
  }

  override fun onCreate() {
    super.onCreate()
    // SoLoader.init(this, false)
    ReactNativeModule.initialize(this, reactNativeHost)
    ReactNativeModule.shared.startReactNative { init -> Log.d("test", "test") }
  }
}
