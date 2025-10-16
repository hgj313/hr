import React from 'react';
import { Select, Space, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import './RegionSelector.css';

const { Text } = Typography;

interface RegionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const regions = [
  { value: 'national', label: '全国', icon: '🇨🇳' },
  { value: 'east', label: '华东', icon: '🌅' },
  { value: 'south', label: '华南', icon: '🌴' },
  { value: 'southwest', label: '西南', icon: '🏔️' },
  { value: 'central', label: '华中', icon: '🌾' },
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="region-selector">
      <Space align="center">
        <GlobalOutlined className="region-icon" />
        <Text className="region-label">区域:</Text>
        <Select
          value={value}
          onChange={onChange}
          className="region-select"
          size="large"
          classNames={{
            popup: {
              root: "region-select-dropdown"
            }
          }}
        >
          {regions.map(region => (
            <Select.Option key={region.value} value={region.value}>
              <Space>
                <span className="region-emoji">{region.icon}</span>
                <span>{region.label}</span>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Space>
    </div>
  );
};

export default RegionSelector;