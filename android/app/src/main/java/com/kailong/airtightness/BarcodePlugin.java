package com.kailong.airtightness;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Barcode")
public class BarcodePlugin extends Plugin {
    private static final String EVENT_SCANNED = "scanned";
    
    @PluginMethod(returnType = PluginMethod.RETURN_NONE)
    public void addListener(PluginCall call) {
        super.addListener(call);
    }

    @PluginMethod(returnType = PluginMethod.RETURN_NONE)
    public void removeListener(PluginCall call) {
        super.removeListener(call);
    }
    
    public void handleScannedCode(String code) {
        JSObject ret = new JSObject();
        ret.put("code", code);
        notifyListeners(EVENT_SCANNED, ret);
    }
} 