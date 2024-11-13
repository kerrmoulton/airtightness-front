export interface Device {
  id: number;
  name: string;
  path: string;
  enable: boolean;
  note: string;
  online: boolean;
}

export interface DeviceDetail extends Device {
  testStatus: TestStatus;
  pressureValue: number;
  leakageValue: number;
  resultStatus: ResultStatus;
  errorMessage: string;
  testing: boolean;
}

export interface TestRecord {
  id: number;
  deviceId: number;
  deviceName: string;
  sn: string;
  tongDao: string;
  pressValue: number;
  leakValue: number;
  result: 'OK' | 'NG' | 'ERROR';
  createTime: string;
}

export enum TestStatus {
  READY = 0,
  FIXTURE_IN = 1,
  CHARGING = 6,
  MEASURE1 = 7,
  MEASURE2 = 8,
  TESTING = 9,
  DISCHARGE = 10,
  FIXTURE_OUT = 14,
  SENSOR_ERROR = 15,
  LIGHT_ERROR = 16,
  PRESSURE_ERROR = 17,
  LARGE_LEAK = 18
}

export enum ResultStatus {
  INIT = 0,
  TESTING = 1,
  PASS = 2,
  FAIL = 3
}

export interface WebSocketMessage {
  type: 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'DEVICE_STATUS';
  deviceId: number;
  data?: DeviceDetail;
}