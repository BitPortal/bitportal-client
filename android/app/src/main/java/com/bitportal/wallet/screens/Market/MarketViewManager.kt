package com.bitportal.wallet

import com.bitportal.wallet.MarketView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

public  class MarketViewManager : SimpleViewManager<MarketView>() {
    override fun getName(): String {
        return "MarketView"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MarketView {
        return MarketView(reactContext)
    }
}