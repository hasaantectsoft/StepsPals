package com.steppals

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
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

            // Set step text
            views.setTextViewText(R.id.tvSteps, "$steps")

            // 🔹 Intent to open the app
            val intent = Intent(context, MainActivity::class.java)

            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // 🔹 Set click listener on the widget
           views.setOnClickPendingIntent(R.id.widgetRoot, pendingIntent)

            // Update widget
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }
}