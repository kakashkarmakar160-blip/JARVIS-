package com.akassai.bridge

import android.content.Context
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

object BridgeHttp {
    private fun prefs(c:Context)=c.getSharedPreferences("bridge",Context.MODE_PRIVATE)
    fun post(c:Context,path:String,json:JSONObject){ Thread { try { val base=prefs(c).getString("url","") ?: ""; val token=prefs(c).getString("token","") ?: ""; if(base.isBlank()||token.isBlank())return@Thread; val con=URL(base+path).openConnection() as HttpURLConnection; con.requestMethod="POST"; con.setRequestProperty("Content-Type","application/json"); con.setRequestProperty("X-Bridge-Token",token); con.doOutput=true; con.connectTimeout=8000; con.readTimeout=8000; con.outputStream.use{it.write(json.toString().toByteArray())}; con.inputStream.close(); con.disconnect() } catch(_:Exception){} }.start() }
}
