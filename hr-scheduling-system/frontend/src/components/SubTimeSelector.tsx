import React from 'react';
import { DatePicker, Space, Typography, Tag, Button } from 'antd';
import { UserOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './SubTimeSelector.css';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

interface TimeRange {
  start: Date;
  end: Date;
  granularity: 'week' | 'month' | 'year';
}

interface SubTimeRange {
  start: Date;
  end: Date;
}

interface SubTimeSelectorProps {
  value: SubTimeRange;
  onChange: (value: SubTimeRange) => void;
  mainTimeRange: TimeRange;
}

const SubTimeSelector: React.FC<SubTimeSelectorProps> = ({ 
  value, 
  onChange, 
  mainTimeRange 
}) => {
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      onChange({
        start: dates[0].toDate(),
        end: dates[1].toDate(),
      });
    }
  };

  const handleQuickSelect = (days: number) => {
    const start = new Date();
    const end = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    onChange({ start, end });
  };

  const isWithinMainRange = () => {
    return value.start >= mainTimeRange.start && value.end <= mainTimeRange.end;
  };

  return (
    <div className="sub-time-selector">
      <div className="selector-header">
        <Space align="center">
          <UserOutlined className="selector-icon" />
          <Title level={5} className="selector-title">人力资源筛选</Title>
          {!isWithinMainRange() && (
            <Tag color="warning" icon={<FilterOutlined />}>
              超出项目范围
            </Tag>
          )}
        </Space>
      </div>
      
      <div className="selector-content">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="date-range-section">
            <Text className="section-label">筛选时间范围</Text>
            <RangePicker
              value={[dayjs(value.start), dayjs(value.end)]}
              onChange={handleDateRangeChange}
              className="date-range-picker"
              size="large"
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              disabledDate={(current) => {
                // 可以选择超出主时间范围的日期，但会有警告提示
                return false;
              }}
            />
          </div>
          
          <div className="quick-select-section">
            <Text className="section-label">快速选择</Text>
            <Space wrap>
              <Button 
                size="small" 
                onClick={() => handleQuickSelect(7)}
                className="quick-btn"
              >
                未来7天
              </Button>
              <Button 
                size="small" 
                onClick={() => handleQuickSelect(14)}
                className="quick-btn"
              >
                未来2周
              </Button>
              <Button 
                size="small" 
                onClick={() => handleQuickSelect(30)}
                className="quick-btn"
              >
                未来1月
              </Button>
            </Space>
          </div>
          
          <div className="filter-info">
            <Text className="info-text">
              🎯 将显示在此时间范围内有空闲时间的员工
            </Text>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default SubTimeSelector;