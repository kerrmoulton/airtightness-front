import React from 'react';
import { ClipboardList, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { TestRecord } from '../types/device';

interface TestRecordsProps {
  records: TestRecord[];
}

export default function TestRecords({ records }: TestRecordsProps) {
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  const getResultIcon = (result: TestRecord['result']) => {
    switch (result) {
      case 'OK':
        return <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500" />;
      case 'NG':
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />;
      case 'ERROR':
        return <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
        <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        测试记录
      </h2>
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="min-w-full table-fixed md:table-auto">
          <thead>
            <tr className="bg-gray-50 text-xs md:text-sm">
              <th className="w-24 md:w-auto px-2 md:px-4 py-2 text-left font-medium text-gray-500">序列号</th>
              <th className="w-16 md:w-auto px-2 md:px-4 py-2 text-left font-medium text-gray-500">通道</th>
              <th className="w-20 md:w-auto px-2 md:px-4 py-2 text-left font-medium text-gray-500">压力值</th>
              <th className="w-20 md:w-auto px-2 md:px-4 py-2 text-left font-medium text-gray-500">泄漏值</th>
              <th className="w-16 md:w-auto px-2 md:px-4 py-2 text-left font-medium text-gray-500">结果</th>
              <th className="hidden md:table-cell px-4 py-2 text-left font-medium text-gray-500">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 text-xs md:text-sm">
                <td className="px-2 md:px-4 py-2 truncate">{record.sn}</td>
                <td className="px-2 md:px-4 py-2">{record.tongDao}</td>
                <td className="px-2 md:px-4 py-2">{record.pressValue.toFixed(2)}</td>
                <td className="px-2 md:px-4 py-2">{record.leakValue.toFixed(3)}</td>
                <td className="px-2 md:px-4 py-2">
                  <div className="flex items-center gap-1">
                    {getResultIcon(record.result)}
                    <span>{record.result}</span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 py-2">
                  {formatDateTime(record.createTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}