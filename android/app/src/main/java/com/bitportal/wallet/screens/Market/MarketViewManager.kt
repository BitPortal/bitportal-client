package com.bitportal.wallet.screens.Market

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

public  class MarketViewManager : SimpleViewManager<MarketView>() {
  override fun getName(): String {
    return "MarketView"
  }

  override fun createViewInstance(reactContext: ThemedReactContext): MarketView {
    return MarketView(reactContext)
  }
}
