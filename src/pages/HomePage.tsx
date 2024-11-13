import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle } from 'lucide-react';
import { Device } from '../types/device';
import { deviceApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await deviceApi.getDevices();
        setDevices(data);
      } catch (err) {
        showToast('设备列表加载失败，请重试', 'error');
        console.error('Error fetching devices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-500" />
        设备列表
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => navigate(`/device/${device.id}`)}
            className="p-6 rounded-lg border-2 border-gray-100 hover:border-blue-500 cursor-pointer transition-all bg-gray-50 hover:bg-blue-50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${device.online ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium text-lg">{device.name}</span>
              </div>
              {!device.enable && (
                <AlertCircle className="w-5 h-5 text-yellow-500" title="设备已禁用" />
              )}
            </div>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">路径:</span>
                <span>{device.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">备注:</span>
                <span>{device.note}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">状态:</span>
                <span className={device.online ? 'text-green-600' : 'text-red-600'}>
                  {device.online ? '在线' : '离线'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}