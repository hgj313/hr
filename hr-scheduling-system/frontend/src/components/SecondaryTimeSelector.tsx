import React, { useState } from 'react';
import { DatePicker, Button, Space, Typography, Tag, Tooltip, Popover } from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface TimeRange {
  id: string;
  start: string;
  end: string;
  color: string;
  label: string;
}

interface SecondaryTimeSelectorProps {
  timeRanges: TimeRange[];
  onTimeRangesChange: (ranges: TimeRange[]) => void;
}

const predefinedColors = [
  { color: '#ff6b6b', name: '红色' },
  { color: '#4ecdc4', name: '青色' },
  { color: '#45b7d1', name: '蓝色' },
  { color: '#96ceb4', name: '绿色' },
  { color: '#feca57', name: '黄色' },
  { color: '#ff9ff3', name: '粉色' },
  { color: '#54a0ff', name: '天蓝' },
  { color: '#5f27cd', name: '紫色' }
];

const SecondaryTimeSelector: React.FC<SecondaryTimeSelectorProps> = ({
  timeRanges,
  onTimeRangesChange
}) => {
  const [newRange, setNewRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0].color);
  const [isAddingRange, setIsAddingRange] = useState(false);

  const addTimeRange = () => {
    if (newRange && newLabel.trim()) {
      const newTimeRange: TimeRange = {
        id: `range_${Date.now()}`,
        start: newRange[0].format('YYYY-MM-DD'),
        end: newRange[1].format('YYYY-MM-DD'),
        color: selectedColor,
        label: newLabel.trim()
      };
      
      onTimeRangesChange([...timeRanges, newTimeRange]);
      
      // 重置表单
      setNewRange(null);
      setNewLabel('');
      setSelectedColor(predefinedColors[0].color);
      setIsAddingRange(false);
    }
  };

  const removeTimeRange = (id: string) => {
    onTimeRangesChange(timeRanges.filter(range => range.id !== id));
  };

  const ColorSelector = () => (
    <div className="grid grid-cols-4 gap-2 p-2">
      {predefinedColors.map((colorOption) => (
        <div
          key={colorOption.color}
          className={`w-6 h-6 rounded cursor-pointer border-2 ${
            selectedColor === colorOption.color ? 'border-gray-800' : 'border-gray-300'
          }`}
          style={{ backgroundColor: colorOption.color }}
          onClick={() => setSelectedColor(colorOption.color)}
          title={colorOption.name}
        />
      ))}
    </div>
  );

  const AddRangeForm = () => (
    <div className="space-y-3 p-3 bg-gray-50 rounded border">
      <div className="flex items-center space-x-2">
        <Text className="text-gray-600 w-16">时间段:</Text>
        <RangePicker
          value={newRange}
          onChange={setNewRange}
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          size="small"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Text className="text-gray-600 w-16">标签:</Text>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="输入时间段标签"
          className="flex-1 px-2 py-1 border rounded text-sm"
          maxLength={20}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Text className="text-gray-600 w-16">颜色:</Text>
        <Popover content={<ColorSelector />} trigger="click" placement="bottom">
          <div
            className="w-6 h-6 rounded border cursor-pointer"
            style={{ backgroundColor: selectedColor }}
          />
        </Popover>
        <Text className="text-xs text-gray-500">点击选择颜色</Text>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button size="small" onClick={() => setIsAddingRange(false)}>
          取消
        </Button>
        <Button 
          size="small" 
          type="primary" 
          onClick={addTimeRange}
          disabled={!newRange || !newLabel.trim()}
        >
          添加
        </Button>
      </div>
    </div>
  );

  return (
    <div className="secondary-time-selector bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-green-500" />
          <Text strong className="text-gray-700">人力资源过滤</Text>
          <Tooltip title="选择多个时间段来过滤显示可用的员工资源">
            <FilterOutlined className="text-gray-400" />
          </Tooltip>
        </div>
        
        <Button
          icon={<PlusOutlined />}
          size="small"
          type="dashed"
          onClick={() => setIsAddingRange(true)}
          disabled={isAddingRange}
        >
          添加时间段
        </Button>
      </div>

      {/* 添加新时间段表单 */}
      {isAddingRange && <AddRangeForm />}

      {/* 已选择的时间段列表 */}
      <div className="space-y-2">
        {timeRanges.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Text>暂无过滤时间段，点击"添加时间段"开始筛选员工资源</Text>
          </div>
        ) : (
          timeRanges.map((range) => (
            <div
              key={range.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: range.color }}
                />
                <div>
                  <Text strong className="text-sm">{range.label}</Text>
                  <div className="text-xs text-gray-500">
                    {dayjs(range.start).format('YYYY-MM-DD')} 至 {dayjs(range.end).format('YYYY-MM-DD')}
                    （{dayjs(range.end).diff(dayjs(range.start), 'day') + 1} 天）
                  </div>
                </div>
              </div>
              
              <Tooltip title="删除此时间段">
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  type="text"
                  danger
                  onClick={() => removeTimeRange(range.id)}
                />
              </Tooltip>
            </div>
          ))
        )}
      </div>

      {/* 过滤说明 */}
      {timeRanges.length > 0 && (
        <div className="mt-3 p-2 bg-green-50 rounded border-l-4 border-green-400">
          <Text className="text-green-700 text-sm">
            <FilterOutlined className="mr-1" />
            将显示在以上 {timeRanges.length} 个时间段内可用的员工资源
          </Text>
        </div>
      )}
    </div>
  );
};

export default SecondaryTimeSelector;