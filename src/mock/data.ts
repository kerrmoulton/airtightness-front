import { Device, DeviceDetail, TestRecord, TestStatus, ResultStatus } from '../types/device';

export const mockDevices: Device[] = [
  {
    id: 1,
    name: '气密检测仪1',
    path: '非道路.气密检测仪1',
    enable: true,
    note: '1号工位',
    online: true
  },
  {
    id: 2,
    name: '气密检测仪2',
    path: '非道路.气密检测仪2',
    enable: true,
    note: '2号工位',
    online: true
  }
];

export const mockDeviceDetail: DeviceDetail = {
  ...mockDevices[0],
  testStatus: TestStatus.READY,
  pressureValue: 0,
  leakageValue: 0,
  resultStatus: ResultStatus.INIT,
  errorMessage: '',
  testing: false
};

export const mockTestRecords: TestRecord[] = [
  {
    id: 1,
    deviceId: 1,
    deviceName: '气密检测仪1',
    sn: 'SN12345',
    tongDao: '1',
    pressValue: 5.0,
    leakValue: 0.02,
    result: 'OK',
    createTime: '2024-03-14 10:00:00'
  },
  {
    id: 2,
    deviceId: 1,
    deviceName: '气密检测仪1',
    sn: 'SN12346',
    tongDao: '1',
    pressValue: 4.8,
    leakValue: 0.05,
    result: 'NG',
    createTime: '2024-03-14 09:45:00'
  }
];