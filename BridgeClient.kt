package com.jarvis.bridge

import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

object BridgeClient {
    fun health(server: String, token: String): String {
        if (server.isBlank() || token.isBlank()) return "Missing server URL or token"
        return try {
            val c = URL("$server/api/bridge/health").openConnection() as HttpURLConnection
            c.requestMethod = "GET"
            c.connectTimeout = 5000
            c.readTimeout = 5000
            c.setRequestProperty("Authorization", "Bearer $token")
            val code = c.responseCode
            c.disconnect()
            if (code == 200) "Connected" else "HTTP $code"
        } catch (e: Exception) {
            "Connection failed: ${e.message}"
        }
    }

    fun send(server: String, token: String, payload: JSONObject): Boolean {
        if (server.isBlank() || token.isBlank()) return false
        return try {
            val c = URL("$server/api/bridge/notifications").openConnection() as HttpURLConnection
            c.requestMethod = "POST"
            c.connectTimeout = 5000
            c.readTimeout = 5000
            c.doOutput = true
            c.setRequestProperty("Content-Type", "application/json")
            c.setRequestProperty("Authorization", "Bearer $token")
            c.outputStream.use { it.write(payload.toString().toByteArray(Charsets.UTF_8)) }
            val code = c.responseCode
            c.disconnect()
            code in 200..299
        } catch (_: Exception) {
            false
        }
    }
}
