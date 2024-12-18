import React from 'react';
import { Gauge, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DeviceDetail, TestStatus, ResultStatus } from '../types/device';

interface DeviceStatusProps {
  device: DeviceDetail;
}

const getTestStatusText = (status: TestStatus): string => {
  const statusMap: Record<TestStatus, string> = {
    [TestStatus.READY]: '准备就绪',
    [TestStatus.FIXTURE_IN]: '夹具进入',
    [TestStatus.CHARGING]: '充气中',
    [TestStatus.MEASURE1]: '测量1',
    [TestStatus.MEASURE2]: '测量2',
    [TestStatus.TESTING]: '测试中',
    [TestStatus.DISCHARGE]: '排气',
    [TestStatus.FIXTURE_OUT]: '夹具退出',
    [TestStatus.SENSOR_ERROR]: '传感器故障',
    [TestStatus.LIGHT_ERROR]: '光幕故障',
    [TestStatus.PRESSURE_ERROR]: '压力超范围',
    [TestStatus.LARGE_LEAK]: '大漏',
  };
  return statusMap[status] || '未知状态';
};

const getResultStatusText = (status: ResultStatus): string => {
  const statusMap: Record<ResultStatus, string> = {
    [ResultStatus.INIT]: '初始状态',
    [ResultStatus.TESTING]: '测试中',
    [ResultStatus.PASS]: '测试合格',
    [ResultStatus.FAIL]: '测试不合格',
  };
  return statusMap[status] || '未知状态';
};

const getResultStatusIcon = (status: ResultStatus) => {
  switch (status) {
    case ResultStatus.PASS:
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case ResultStatus.FAIL:
      return <XCircle className="w-6 h-6 text-red-500" />;
    case ResultStatus.TESTING:
      return <Gauge className="w-6 h-6 text-blue-500 animate-pulse" />;
    case ResultStatus.INIT:
      return <Gauge className="w-6 h-6 text-gray-400" />;
    default:
      return null;
  }
};

export default function DeviceStatus({ device }: DeviceStatusProps) {
  const isError = device.testStatus >= TestStatus.SENSOR_ERROR;
  const isOffline = !device.online;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Gauge className="w-6 h-6 text-blue-500" />
          设备状态
        </h2>
        {getResultStatusIcon(device.resultStatus)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">测试状态</div>
          <div className="mt-1 font-medium">
            {device.testStatus !== null ? getTestStatusText(device.testStatus) : '离线'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">压力值</div>
          <div className="mt-1 font-medium">
            {device.pressureValue !== null ? `${device.pressureValue.toFixed(2)} MPa` : '- -'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">泄漏值</div>
          <div className="mt-1 font-medium">
            {device.leakageValue !== null ? `${device.leakageValue.toFixed(3)} mL/min` : '- -'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">结果状态</div>
          <div className="mt-1 font-medium">
            {device.resultStatus !== null ? getResultStatusText(device.resultStatus) : '离线'}
          </div>
        </div>
      </div>

      {(isError || isOffline) && (
        <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
          isOffline ? 'bg-gray-50 text-gray-700' : 'bg-red-50 text-red-700'
        }`}>
          <AlertTriangle className="w-5 h-5" />
          <span>{isOffline ? '设备离线' : (device.errorMessage || '设备发生错误')}</span>
        </div>
      )}
    </div>
  );
}
