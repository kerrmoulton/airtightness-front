package com.kailong.airtightness;

import android.os.Bundle;
import android.view.KeyEvent;
import android.util.Log;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.webkit.ValueCallback;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private StringBuilder scanBuilder = new StringBuilder();
    private BarcodePlugin barcodePlugin;
    private BroadcastReceiver scanReceiver;
    
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
        
        // 注册广播接收器
        registerScanReceiver();
    }

    private void registerScanReceiver() {
        scanReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // 输出完整的 intent 信息用于调试
                Log.d(TAG, "Received intent action: " + intent.getAction());
                Bundle extras = intent.getExtras();
                if (extras != null) {
                    for (String key : extras.keySet()) {
                        Log.d(TAG, "Intent extra - " + key + ": " + extras.get(key));
                    }
                }

                // 处理不同厂商的广播返回值（以下是常见的几种）
                String scanResult = null;
                
                // 获取完整的key名称
                for (String key : extras.keySet()) {
                    if (key.endsWith("data_string")) {
                        scanResult = intent.getStringExtra(key);
                        Log.d(TAG, "Found data_string extra with key: " + key);
                        break;
                    } else if (key.endsWith("scannerdata")) {
                        scanResult = intent.getStringExtra(key);
                        Log.d(TAG, "Found scannerdata extra with key: " + key); 
                        break;
                    } else if (key.endsWith("data")) {
                        scanResult = intent.getStringExtra(key);
                        Log.d(TAG, "Found data extra with key: " + key);
                        break;
                    }
                }

                if (scanResult != null && !scanResult.isEmpty()) {
                    Log.d(TAG, "Broadcast scan result: " + scanResult);
                    // 发送到插件
                    if (barcodePlugin != null) {
                        barcodePlugin.handleScannedCode(scanResult);
                    }
                } else {
                    Log.d(TAG, "No valid scan result found in intent");
                }
            }
        };

        // 创建 IntentFilter
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.intent.ACTION_DECODE_DATA");
        filter.addAction("scan.rcv.message");
        filter.addAction("com.android.server.scannerservice.broadcast");

        // Android 13 (API 33) 及以上版本使用新的注册方式
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(scanReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(scanReceiver, filter);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // 注销广播接收器
        if (scanReceiver != null) {
            unregisterReceiver(scanReceiver);
            scanReceiver = null;
        }
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

    @Override
    public void onBackPressed() {
        WebView webView = getBridge().getWebView();
        
        Log.d(TAG, "onBackPressed called");
        
        webView.evaluateJavascript(
            "(function() { " +
                "const isHomePage = window.location.pathname === '/';" +
                "const hasHistory = window.history.length > 1;" +
                "if (hasHistory && !isHomePage) {" +
                "  window.history.back();" +
                "  return 'navigate';" +
                "} else {" +
                "  return 'exit';" +
                "}" +
            "})()",
            new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {
                    Log.d(TAG, "evaluateJavascript callback value: " + value);
                    if ("\"exit\"".equals(value)) {  // 注意 JS 返回的字符串会被包含在双引号中
                        Log.d(TAG, "On homepage or no history, exiting app");
                        MainActivity.super.onBackPressed();
                    } else {
                        Log.d(TAG, "Navigating back in history");
                    }
                }
            }
        );
    }
}