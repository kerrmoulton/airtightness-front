import React, { useState, useEffect } from 'react';
import { Play, Square, Scan } from 'lucide-react';
import { DeviceDetail } from '../types/device';

interface TestControlProps {
  device: DeviceDetail;
  onStartTest: (sn: string) => void;
  onStopTest: () => void;
}

declare global {
  interface Window {
    Capacitor: {
      Plugins: {
        Barcode: {
          addListener: (eventName: string, callback: (data: { code: string }) => void) => {
            remove: () => void;
          };
        };
      };
    };
  }
}

export default function TestControl({ device, onStartTest, onStopTest }: TestControlProps) {
  const [sn, setSn] = useState('');

  useEffect(() => {
    // 监听扫码事件
    if (window.Capacitor?.Plugins?.Barcode) {
      const listener = window.Capacitor.Plugins.Barcode.addListener('scanned', (data) => {
        try {
          console.log('Received barcode data:', data);
          if (data.code && !device.testing) {
            setSn(data.code);
            // 自动触发测试开始
            onStartTest(data.code);
          }
        } catch (err) {
          console.error('Error handling barcode data:', err);
        }
      });

      // 清理监听器
      return () => {
        listener.remove();
      };
    }
  }, [device.testing, onStartTest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sn.trim()) {
      onStartTest(sn.trim());
      setSn('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sn" className="block text-sm font-medium text-gray-700 mb-1">
            产品序列号
          </label>
          <div className="relative">
            <input
              type="text"
              id="sn"
              value={sn}
              onChange={(e) => setSn(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="请扫描或输入序列号"
              disabled={device.testing}
            />
            <Scan className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!sn.trim() || device.testing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            开始测试
          </button>
          <button
            type="button"
            onClick={onStopTest}
            disabled={!device.testing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="w-5 h-5" />
            停止测试
          </button>
        </div>
      </form>
    </div>
  );
}