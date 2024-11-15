package com.kailong.airtightness;

import android.os.Bundle;
import android.view.KeyEvent;
import android.util.Log;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private StringBuilder scanBuilder = new StringBuilder();
    private BarcodePlugin barcodePlugin;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // 注册插件必须在 super.onCreate 之前
        registerPlugin(BarcodePlugin.class);
        super.onCreate(savedInstanceState);
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setDatabaseEnabled(true);
        
        // 获取插件实例
        barcodePlugin = (BarcodePlugin) getBridge().getPlugin("Barcode").getInstance();
    }

    @Override
    public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
        Log.d(TAG, "onKeyMultiple - keyCode: " + keyCode + ", repeatCount: " + repeatCount);
        
        if (keyCode == KeyEvent.KEYCODE_UNKNOWN && event.getAction() == KeyEvent.ACTION_MULTIPLE) {
            String scannedCode = event.getCharacters();
            if (scannedCode != null && !scannedCode.isEmpty()) {
                Log.d(TAG, "Scanned code: " + scannedCode);
                Toast.makeText(this, "扫码结果: " + scannedCode, Toast.LENGTH_SHORT).show();
                
                // 通过插件发送扫描结果
                if (barcodePlugin != null) {
                    barcodePlugin.handleScannedCode(scannedCode);
                }
                return true;
            }
        }
        return super.onKeyMultiple(keyCode, repeatCount, event);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.d(TAG, "onKeyDown - keyCode: " + keyCode);
        
        if (keyCode != KeyEvent.KEYCODE_BACK) {  // 排除返回键
            scanBuilder.append((char) event.getUnicodeChar());
            
            // 如果收到回车键，表示扫码结束
            if (keyCode == KeyEvent.KEYCODE_ENTER) {
                String scannedCode = scanBuilder.toString();
                Log.d(TAG, "Scanned code (from onKeyDown): " + scannedCode);
                Toast.makeText(this, "扫码结果: " + scannedCode, Toast.LENGTH_SHORT).show();
                
                // 发送到插件
                if (barcodePlugin != null) {
                    barcodePlugin.handleScannedCode(scannedCode);
                }
                
                // 清空缓存
                scanBuilder.setLength(0);
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}