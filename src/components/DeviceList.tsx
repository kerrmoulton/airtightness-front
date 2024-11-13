import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Device } from '../types/device';

interface DeviceListProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
}

export default function DeviceList({ devices, selectedDevice, onSelectDevice }: DeviceListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        设备列表
      </h2>
      <div className="space-y-2">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedDevice?.id === device.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-gray-50 border-2 border-transparent hover:border-blue-200'
            }`}
            onClick={() => onSelectDevice(device)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${device.online ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">{device.name}</span>
              </div>
              {!device.enable && (
                <AlertCircle className="w-5 h-5 text-yellow-500" title="设备已禁用" />
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>路径: {device.path}</div>
              <div>备注: {device.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}