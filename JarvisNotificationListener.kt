package com.akassai.bridge

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import org.json.JSONObject

class JarvisNotificationListener: NotificationListenerService(){
    override fun onNotificationPosted(sbn:StatusBarNotification){
        val extras=sbn.notification.extras
        val title=extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
        val text=extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
        val app=try{packageManager.getApplicationLabel(packageManager.getApplicationInfo(sbn.packageName,0)).toString()}catch(_:Exception){sbn.packageName}
        val j=JSONObject().put("app",app).put("packageName",sbn.packageName).put("title",title).put("text",text).put("timestamp",System.currentTimeMillis())
        BridgeHttp.post(this,"/api/bridge/notification",j)
    }
}
