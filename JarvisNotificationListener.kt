package com.jarvis.bridge

import android.app.Notification
import android.content.Context
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import org.json.JSONObject

class JarvisNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val prefs = getSharedPreferences("jarvis", Context.MODE_PRIVATE)
        val server = prefs.getString("server", "")?.trim()?.trimEnd('/') ?: ""
        val token = prefs.getString("token", "")?.trim() ?: ""
        if (server.isBlank() || token.isBlank()) return

        val extras = sbn.notification.extras
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
        val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString() ?: ""

        val payload = JSONObject().apply {
            put("id", sbn.key)
            put("packageName", sbn.packageName)
            put("appName", appLabel(sbn.packageName))
            put("title", title)
            put("text", if (bigText.isNotBlank()) bigText else text)
            put("timestamp", sbn.postTime)
            put("category", sbn.notification.category ?: "")
            put("isOngoing", sbn.isOngoing)
        }

        Thread { BridgeClient.send(server, token, payload) }.start()
    }

    private fun appLabel(packageName: String): String {
        return try {
            val info = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(info).toString()
        } catch (_: Exception) {
            packageName
        }
    }
}
