package com.steppals

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class StepWidgetModule(private val context: ReactApplicationContext)
    : ReactContextBaseJavaModule(context) {

    override fun getName(): String = "StepWidget"

    @ReactMethod
    fun updateSteps(steps: Int) {

        val prefs: SharedPreferences =
            context.getSharedPreferences("StepWidgetPrefs", Context.MODE_PRIVATE)
        prefs.edit().putInt("steps", steps).apply()

        val widgetManager = AppWidgetManager.getInstance(context)
        val widget = ComponentName(context, StepWidget::class.java)
        widgetManager.notifyAppWidgetViewDataChanged(
            widgetManager.getAppWidgetIds(widget),
            R.id.tvSteps
        )
    }
}