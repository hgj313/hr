import React, { useState } from 'react';
import { DatePicker, Select, Space, Typography, Button, Tooltip } from 'antd';
import { CalendarOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface PrimaryTimeSelectorProps {
  timeRange: [string, string];
  precision: 'day' | 'week' | 'month' | 'quarter';
  onTimeRangeChange: (range: [string, string]) => void;
  onPrecisionChange: (precision: 'day' | 'week' | 'month' | 'quarter') => void;
}

const precisionOptions = [
  { value: 'day', label: '日视图', icon: '📅' },
  { value: 'week', label: '周视图', icon: '📆' },
  { value: 'month', label: '月视图', icon: '🗓️' },
  { value: 'quarter', label: '季度视图', icon: '📊' }
];

const quickRanges = [
  {
    label: '本月',
    value: () => [dayjs().startOf('month'), dayjs().endOf('month')] as [Dayjs, Dayjs]
  },
  {
    label: '下月',
    value: () => [dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month')] as [Dayjs, Dayjs]
  },
  {
    label: '本季度',
    value: () => [dayjs().startOf('quarter'), dayjs().endOf('quarter')] as [Dayjs, Dayjs]
  },
  {
    label: '下季度',
    value: () => [dayjs().add(1, 'quarter').startOf('quarter'), dayjs().add(1, 'quarter').endOf('quarter')] as [Dayjs, Dayjs]
  },
  {
    label: '今年',
    value: () => [dayjs().startOf('year'), dayjs().endOf('year')] as [Dayjs, Dayjs]
  }
];

const PrimaryTimeSelector: React.FC<PrimaryTimeSelectorProps> = ({
  timeRange,
  precision,
  onTimeRangeChange,
  onPrecisionChange
}) => {
  const [selectedRange, setSelectedRange] = useState<[Dayjs, Dayjs] | null>(
    timeRange ? [dayjs(timeRange[0]), dayjs(timeRange[1])] : null
  );

  const handleRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    setSelectedRange(dates);
    if (dates) {
      onTimeRangeChange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
    }
  };

  const handleQuickRange = (rangeFunc: () => [Dayjs, Dayjs]) => {
    const range = rangeFunc();
    handleRangeChange(range);
  };

  const zoomIn = () => {
    const currentIndex = precisionOptions.findIndex(p => p.value === precision);
    if (currentIndex > 0) {
      onPrecisionChange(precisionOptions[currentIndex - 1].value as any);
    }
  };

  const zoomOut = () => {
    const currentIndex = precisionOptions.findIndex(p => p.value === precision);
    if (currentIndex < precisionOptions.length - 1) {
      onPrecisionChange(precisionOptions[currentIndex + 1].value as any);
    }
  };

  return (
    <div className="primary-time-selector bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-blue-500" />
          <Text strong className="text-gray-700">项目时间范围</Text>
        </div>
        
        {/* 精度控制 */}
        <div className="flex items-center space-x-2">
          <Tooltip title="放大视图">
            <Button 
              icon={<ZoomInOutlined />} 
              size="small" 
              onClick={zoomIn}
              disabled={precision === 'day'}
            />
          </Tooltip>
          
          <Select
            value={precision}
            onChange={onPrecisionChange}
            size="small"
            className="w-24"
          >
            {precisionOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <Space>
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </Space>
              </Select.Option>
            ))}
          </Select>
          
          <Tooltip title="缩小视图">
            <Button 
              icon={<ZoomOutOutlined />} 
              size="small" 
              onClick={zoomOut}
              disabled={precision === 'quarter'}
            />
          </Tooltip>
        </div>
      </div>

      <div className="space-y-3">
        {/* 快速选择按钮 - 移到上方 */}
        <div className="flex items-center space-x-1">
          <Text className="text-gray-600 text-sm mr-2">快速选择:</Text>
          {quickRanges.map((range, index) => (
            <Button
              key={index}
              size="small"
              type="text"
              onClick={() => handleQuickRange(range.value)}
              className="text-blue-600 hover:bg-blue-50 px-2 py-1"
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* 主时间选择器 */}
        <div className="flex items-center space-x-2">
          <Text className="text-gray-600">时间区间:</Text>
          <RangePicker
            value={selectedRange}
            onChange={handleRangeChange}
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
            className="w-64"
            allowClear
          />
        </div>
      </div>

      {/* 当前选择显示 */}
      {selectedRange && (
        <div className="mt-2 p-1.5 bg-blue-50 rounded border-l-3 border-blue-400">
          <Text className="text-blue-700 text-xs">
            已选择: {selectedRange[0].format('YYYY年MM月DD日')} 至 {selectedRange[1].format('YYYY年MM月DD日')}
            （共 {selectedRange[1].diff(selectedRange[0], 'day') + 1} 天）
          </Text>
        </div>
      )}
    </div>
  );
};

export default PrimaryTimeSelector;