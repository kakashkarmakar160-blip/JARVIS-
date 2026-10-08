package com.jarvis.bridge

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val server = findViewById<EditText>(R.id.serverUrl)
        val token = findViewById<EditText>(R.id.bridgeToken)
        val status = findViewById<TextView>(R.id.status)

        server.setText(getSharedPreferences("jarvis", MODE_PRIVATE).getString("server", ""))
        token.setText(getSharedPreferences("jarvis", MODE_PRIVATE).getString("token", ""))

        findViewById<Button>(R.id.save).setOnClickListener {
            getSharedPreferences("jarvis", MODE_PRIVATE).edit()
                .putString("server", server.text.toString().trim().trimEnd('/'))
                .putString("token", token.text.toString().trim())
                .apply()
            status.text = "Status: Saved"
        }

        findViewById<Button>(R.id.access).setOnClickListener {
            startActivity(Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"))
        }

        findViewById<Button>(R.id.test).setOnClickListener {
            getSharedPreferences("jarvis", MODE_PRIVATE).edit()
                .putString("server", server.text.toString().trim().trimEnd('/'))
                .putString("token", token.text.toString().trim())
                .apply()
            Thread {
                val result = BridgeClient.health(
                    server.text.toString().trim().trimEnd('/'),
                    token.text.toString().trim()
                )
                runOnUiThread { status.text = "Status: $result" }
            }.start()
        }
    }
}
