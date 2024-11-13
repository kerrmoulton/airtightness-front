import axios, { AxiosError } from 'axios';
import {
  Device,
  DeviceDetail,
  TestRecord,
  WebSocketMessage,
} from '../types/device';

const API_BASE = 'https://klapi.kailong.net/test/mes/AirTightness/Device';
const WS_BASE = 'wss://klapi.kailong.net/test/ws/mes/AirTightness/Device';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    if (axiosError.response?.data) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('网络请求失败，请检查网络连接');
  }
  throw error;
};

const checkBusinessError = <T>(response: ApiResponse<T>): T => {
  if (response.code !== 1) {
    throw new Error(response.message || '操作失败');
  }
  return response.data;
};

export const deviceApi = {
  getDevices: async (): Promise<Device[]> => {
    try {
      const response = await api.get<ApiResponse<Device[]>>('/list');
      return checkBusinessError(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getDeviceDetail: async (deviceId: number): Promise<DeviceDetail> => {
    try {
      const response = await api.get<ApiResponse<DeviceDetail>>(`/${deviceId}`);
      return checkBusinessError(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  startTest: async (
    deviceId: number,
    sn: string
  ): Promise<{ deviceId: number; sn: string }> => {
    try {
      const response = await api.post<
        ApiResponse<{ deviceId: number; sn: string }>
      >(`/startTest?deviceId=${deviceId}&sn=${sn}`);
      return checkBusinessError(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  stopTest: async (deviceId: number): Promise<string> => {
    try {
      const response = await api.post<ApiResponse<string>>(
        `/stopTest?deviceId=${deviceId}`
      );
      return checkBusinessError(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTestRecords: async (
    deviceId: number,
    limit: number = 10
  ): Promise<TestRecord[]> => {
    try {
      const response = await api.get<ApiResponse<TestRecord[]>>(
        `/${deviceId}/records`,
        {
          params: { limit },
        }
      );
      return checkBusinessError(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

type WebSocketEventHandler = (message: WebSocketMessage) => void;
type ConnectionEventHandler = () => void;

export class DeviceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageHandler: WebSocketEventHandler | null = null;
  private connectionHandlers: Set<ConnectionEventHandler> = new Set();
  private pendingSubscriptions: Set<number> = new Set();
  private isConnecting = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;

    this.isConnecting = true;
    this.ws = new WebSocket(WS_BASE);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      // Resubscribe to pending subscriptions
      this.pendingSubscriptions.forEach(deviceId => {
        this.sendSubscription(deviceId);
      });
      
      // Notify connection handlers
      this.connectionHandlers.forEach(handler => handler());
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.messageHandler?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.isConnecting = false;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectTimeout * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
    };
  }

  private sendSubscription(deviceId: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'SUBSCRIBE',
          deviceId,
        })
      );
      return true;
    }
    return false;
  }

  subscribe(deviceId: number) {
    this.pendingSubscriptions.add(deviceId);
    
    if (!this.sendSubscription(deviceId)) {
      // If not connected, ensure connection is established
      if (!this.isConnecting) {
        this.connect();
      }
    }
  }

  unsubscribe(deviceId: number) {
    this.pendingSubscriptions.delete(deviceId);
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'UNSUBSCRIBE',
          deviceId,
        })
      );
    }
  }

  onMessage(handler: WebSocketEventHandler) {
    this.messageHandler = handler;
  }

  onConnect(handler: ConnectionEventHandler) {
    this.connectionHandlers.add(handler);
    // If already connected, call handler immediately
    if (this.ws?.readyState === WebSocket.OPEN) {
      handler();
    }
  }

  offConnect(handler: ConnectionEventHandler) {
    this.connectionHandlers.delete(handler);
  }

  close() {
    this.pendingSubscriptions.clear();
    this.connectionHandlers.clear();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}