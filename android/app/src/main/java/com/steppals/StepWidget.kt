package com.steppals

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.content.SharedPreferences

class StepWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs: SharedPreferences =
            context.getSharedPreferences("StepWidgetPrefs", Context.MODE_PRIVATE)

        val steps = prefs.getInt("steps", 0)

        appWidgetIds.forEach { widgetId ->
            val views = RemoteViews(context.packageName, R.layout.step_widget)
            views.setTextViewText(R.id.tvSteps, "$steps")
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }
}