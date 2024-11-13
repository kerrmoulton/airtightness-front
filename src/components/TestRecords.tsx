import React from 'react';
import { ClipboardList, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { TestRecord } from '../types/device';

interface TestRecordsProps {
  records: TestRecord[];
}

export default function TestRecords({ records }: TestRecordsProps) {
  const getResultIcon = (result: TestRecord['result']) => {
    switch (result) {
      case 'OK':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'NG':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'ERROR':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-blue-500" />
        测试记录
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">序列号</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">通道</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">压力值</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">泄漏值</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">结果</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{record.sn}</td>
                <td className="px-4 py-3 text-sm">{record.tongDao}</td>
                <td className="px-4 py-3 text-sm">{record.pressValue.toFixed(2)} MPa</td>
                <td className="px-4 py-3 text-sm">{record.leakValue.toFixed(3)} mL/min</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {getResultIcon(record.result)}
                    <span className="text-sm">{record.result}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{record.createTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}