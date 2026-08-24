package com.codegascolombia

import android.content.ClipData
import android.content.Intent
import android.content.pm.PackageManager
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class ShareFileModule(private val ctx: ReactApplicationContext) :
    ReactContextBaseJavaModule(ctx) {

    override fun getName() = "ShareFile"

    @ReactMethod
    fun share(path: String, mime: String, title: String, promise: Promise) {
        try {
            val file = File(path.replace("file://", ""))
            if (!file.exists()) {
                promise.reject("ENOENT", "File not found: ${file.absolutePath}")
                return
            }
            val uri = FileProvider.getUriForFile(
                ctx,
                "${ctx.packageName}.provider",
                file
            )
            val send = Intent(Intent.ACTION_SEND).apply {
                type = mime.ifBlank { "application/pdf" }
                putExtra(Intent.EXTRA_STREAM, uri)
                clipData = ClipData.newRawUri(title, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val chooser = Intent.createChooser(send, title).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val matches = ctx.packageManager.queryIntentActivities(
                chooser,
                PackageManager.MATCH_DEFAULT_ONLY
            )
            for (info in matches) {
                ctx.grantUriPermission(
                    info.activityInfo.packageName,
                    uri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
            }
            ctx.startActivity(chooser)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ESHARE", e.message, e)
        }
    }
}
