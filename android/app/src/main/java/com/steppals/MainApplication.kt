package com.steppals

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.steppals.StepWidgetPackage // ✅ your widget package

class MainApplication : Application(), ReactApplication {

    // React Host with manually added StepWidgetPackage
    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList = PackageList(this).packages + StepWidgetPackage() // ✅ append your package
        )
    }

    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)
    }
}