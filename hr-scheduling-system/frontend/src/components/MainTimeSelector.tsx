import React from 'react';
import { DatePicker, Select, Space, Typography, Divider } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './MainTimeSelector.css';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

interface TimeRange {
  start: Date;
  end: Date;
  granularity: 'week' | 'month' | 'year';
}

interface MainTimeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const granularityOptions = [
  { value: 'week', label: '周视图', icon: '📅' },
  { value: 'month', label: '月视图', icon: '🗓️' },
  { value: 'year', label: '年视图', icon: '📆' },
];

const MainTimeSelector: React.FC<MainTimeSelectorProps> = ({ value, onChange }) => {
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      onChange({
        ...value,
        start: dates[0].toDate(),
        end: dates[1].toDate(),
      });
    }
  };

  const handleGranularityChange = (granularity: 'week' | 'month' | 'year') => {
    onChange({
      ...value,
      granularity,
    });
  };

  return (
    <div className="main-time-selector">
      <div className="selector-header">
        <Space align="center">
          <CalendarOutlined className="selector-icon" />
          <Title level={5} className="selector-title">项目时间区间</Title>
        </Space>
      </div>
      
      <div className="selector-content">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="date-range-section">
            <Text className="section-label">时间范围</Text>
            <RangePicker
              value={[dayjs(value.start), dayjs(value.end)]}
              onChange={handleDateRangeChange}
              className="date-range-picker"
              size="large"
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </div>
          
          <Divider style={{ margin: '8px 0' }} />
          
          <div className="granularity-section">
            <Text className="section-label">时间粒度</Text>
            <Select
              value={value.granularity}
              onChange={handleGranularityChange}
              className="granularity-select"
              size="large"
              style={{ width: '100%' }}
            >
              {granularityOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  <Space>
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default MainTimeSelector;