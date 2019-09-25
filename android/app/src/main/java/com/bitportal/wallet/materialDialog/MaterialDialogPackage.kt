package com.bitportal.wallet.materialDialog

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

import java.util.ArrayList
import java.util.Collections
import java.util.Collections.emptyList

class MaterialDialogPackage : ReactPackage {
        override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
                return emptyList<ViewManager<*, *>>()
        }

        override fun createNativeModules(
                reactContext: ReactApplicationContext): List<NativeModule> {
                val modules = ArrayList<NativeModule>()

                modules.add(MaterialDialogModule(reactContext))

                return modules
        }
        
}
