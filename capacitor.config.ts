import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kailong.airtightness',
  appName: '气密检测系统',
  webDir: 'dist',
  plugins: {
    Barcode: {
      // 插件配置（如果需要）
    }
  }
};

export default config;
