package com.akassai.bridge

import android.Manifest
import android.app.*
import android.content.*
import android.content.pm.PackageManager
import android.net.Uri
import android.os.*
import android.provider.Settings
import android.widget.*
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : Activity() {
    private lateinit var url: EditText
    private lateinit var token: EditText
    private val prefs by lazy { getSharedPreferences("bridge", MODE_PRIVATE) }
    override fun onCreate(savedInstanceState: Bundle?) { super.onCreate(savedInstanceState)
        val box=LinearLayout(this); box.orientation=LinearLayout.VERTICAL; box.setPadding(32,32,32,32)
        val title=TextView(this); title.text="Akash AI — Android Bridge"; title.textSize=24f; box.addView(title)
        val info=TextView(this); info.text="Connect this companion to the JARVIS website. It can forward notifications and location only after Android permissions are granted."; box.addView(info)
        url=EditText(this); url.hint="Website URL, e.g. http://192.168.1.5:3000"; url.setText(prefs.getString("url","")); box.addView(url)
        token=EditText(this); token.hint="Bridge token"; token.setText(prefs.getString("token","")); box.addView(token)
        val save=Button(this); save.text="Save Connection"; box.addView(save); save.setOnClickListener{prefs.edit().putString("url",url.text.toString().trim().removeSuffix("/")).putString("token",token.text.toString().trim()).apply(); Toast.makeText(this,"Saved",Toast.LENGTH_SHORT).show()}
        val notif=Button(this); notif.text="Open Notification Access"; box.addView(notif); notif.setOnClickListener{startActivity(Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"))}
        val loc=Button(this); loc.text="Grant Location + Start Monitor"; box.addView(loc); loc.setOnClickListener{requestLocation()}
        val stop=Button(this); stop.text="Stop Location Monitor"; box.addView(stop); stop.setOnClickListener{stopService(Intent(this,LocationMonitorService::class.java))}
        val status=TextView(this); status.text="\nTip: after granting Notification Access, Android will let the bridge receive notifications from apps. The bridge forwards notification metadata/text to your private JARVIS server."; box.addView(status)
        setContentView(box)
    }
    private fun requestLocation(){
        if(ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED){ActivityCompat.requestPermissions(this,arrayOf(Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION),42);return}
        if(Build.VERSION.SDK_INT>=29 && ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_BACKGROUND_LOCATION)!=PackageManager.PERMISSION_GRANTED){ActivityCompat.requestPermissions(this,arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),43);return}
        ContextCompat.startForegroundService(this,Intent(this,LocationMonitorService::class.java))
    }
}
