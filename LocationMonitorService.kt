package com.akassai.bridge

import android.app.*
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import org.json.JSONObject

class LocationMonitorService:Service(){
    private lateinit var client:FusedLocationProviderClient
    private val callback=object:LocationCallback(){override fun onLocationResult(r:LocationResult){r.lastLocation?.let{loc->BridgeHttp.post(this@LocationMonitorService,"/api/bridge/location",JSONObject().put("lat",loc.latitude).put("lng",loc.longitude).put("accuracy",loc.accuracy).put("timestamp",System.currentTimeMillis()))}}}
    override fun onCreate(){super.onCreate();val ch=NotificationChannel("jarvis_location","JARVIS Location",NotificationManager.IMPORTANCE_LOW);getSystemService(NotificationManager::class.java).createNotificationChannel(ch);startForeground(7,NotificationCompat.Builder(this,"jarvis_location").setSmallIcon(android.R.drawable.ic_menu_mylocation).setContentTitle("Akash AI location monitor").setContentText("Safety monitoring is active").build());client=LocationServices.getFusedLocationProviderClient(this);val req=LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY,30000).setMinUpdateIntervalMillis(15000).build();client.requestLocationUpdates(req,callback,mainLooper)}
    override fun onDestroy(){if(::client.isInitialized)client.removeLocationUpdates(callback);super.onDestroy()}
    override fun onBind(intent:Intent?):IBinder?=null
}
