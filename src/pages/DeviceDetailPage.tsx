import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DeviceDetail, TestRecord, WebSocketMessage } from '../types/device';
import { deviceApi, DeviceWebSocket } from '../services/api';
import DeviceStatus from '../components/DeviceStatus';
import TestControl from '../components/TestControl';
import TestRecords from '../components/TestRecords';
import { useToast } from '../contexts/ToastContext';
import { useInterval } from '../hooks/useInterval';

const REFRESH_INTERVAL = 5000; // 5 seconds

export default function DeviceDetailPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deviceDetail, setDeviceDetail] = useState<DeviceDetail | null>(null);
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [ws] = useState(() => new DeviceWebSocket());

  const fetchDeviceDetail = useCallback(async () => {
    if (!deviceId) return;
    try {
      const data = await deviceApi.getDeviceDetail(Number(deviceId));
      setDeviceDetail(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '设备详情加载失败';
      showToast(message, 'error');
      console.error('Error fetching device details:', err);
    } finally {
      setLoading(false);
    }
  }, [deviceId, showToast]);

  const fetchTestRecords = useCallback(async () => {
    if (!deviceId) return;
    try {
      const data = await deviceApi.getTestRecords(Number(deviceId));
      setRecords(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '测试记录加载失败';
      showToast(message, 'error');
      console.error('Error fetching test records:', err);
    }
  }, [deviceId, showToast]);

  // Set up automatic refresh for test records
  useInterval(fetchTestRecords, deviceDetail ? REFRESH_INTERVAL : null);

  useEffect(() => {
    fetchDeviceDetail();
    fetchTestRecords();

    if (deviceId) {
      const numericDeviceId = Number(deviceId);
      
      // Set up message handler
      ws.onMessage((message: WebSocketMessage) => {
        if (message.type === 'DEVICE_STATUS' && message.data) {
          setDeviceDetail(prev => ({
            ...prev!,
            ...message.data,
          }));
        }
      });

      // Subscribe when WebSocket is connected
      ws.onConnect(() => {
        ws.subscribe(numericDeviceId);
      });

      // Initial subscription attempt
      ws.subscribe(numericDeviceId);

      return () => {
        ws.unsubscribe(numericDeviceId);
      };
    }
  }, [deviceId, ws, fetchDeviceDetail, fetchTestRecords]);

  const handleStartTest = async (sn: string) => {
    if (!deviceDetail) return;
    try {
      await deviceApi.startTest(deviceDetail.id, sn);
      showToast('测试已开始', 'success');
      // Refresh test records immediately after starting a test
      fetchTestRecords();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '启动测试失败，请重试';
      showToast(message, 'error');
      console.error('Error starting test:', err);
    }
  };

  const handleStopTest = async () => {
    if (!deviceDetail) return;
    try {
      await deviceApi.stopTest(deviceDetail.id);
      showToast('测试已停止', 'success');
      // Refresh test records immediately after stopping a test
      fetchTestRecords();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '停止测试失败，请重试';
      showToast(message, 'error');
      console.error('Error stopping test:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!deviceDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        设备不存在或已被删除
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          返回设备列表
        </button>
        <h1 className="text-2xl font-bold">{deviceDetail.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceStatus device={deviceDetail} />
        <TestControl
          device={deviceDetail}
          onStartTest={handleStartTest}
          onStopTest={handleStopTest}
        />
      </div>

      <TestRecords records={records} />
    </div>
  );
}