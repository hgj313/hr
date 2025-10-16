import React, { useState, useMemo } from 'react';
import { Card, Avatar, Tag, Typography, Input, Space, Badge, Tooltip } from 'antd';
import { UserOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './ResourcePool.css';

const { Text, Title } = Typography;
const { Search } = Input;

interface SubTimeRange {
  start: Date;
  end: Date;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  skills: string[];
  avatar?: string;
  region: string;
  availability: {
    start: Date;
    end: Date;
    status: 'available' | 'busy' | 'partial';
  }[];
  currentProjects: number;
  rating: number;
}

interface ResourcePoolProps {
  region: string;
  timeRange: SubTimeRange;
}

// 模拟员工数据
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: '张三',
    department: '技术部',
    position: '高级工程师',
    skills: ['React', 'Node.js', 'Python'],
    region: 'east',
    availability: [
      { start: new Date(), end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'available' }
    ],
    currentProjects: 1,
    rating: 4.8
  },
  {
    id: '2',
    name: '李四',
    department: '设计部',
    position: 'UI设计师',
    skills: ['Figma', 'Sketch', 'Photoshop'],
    region: 'south',
    availability: [
      { start: new Date(), end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), status: 'partial' }
    ],
    currentProjects: 2,
    rating: 4.6
  },
  {
    id: '3',
    name: '王五',
    department: '产品部',
    position: '产品经理',
    skills: ['产品设计', '需求分析', '项目管理'],
    region: 'national',
    availability: [
      { start: new Date(), end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: 'available' }
    ],
    currentProjects: 0,
    rating: 4.9
  },
  {
    id: '4',
    name: '赵六',
    department: '技术部',
    position: '前端工程师',
    skills: ['Vue', 'React', 'TypeScript'],
    region: 'central',
    availability: [
      { start: new Date(), end: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), status: 'available' }
    ],
    currentProjects: 1,
    rating: 4.7
  }
];

const ResourcePool: React.FC<ResourcePoolProps> = ({ region, timeRange }) => {
  const [searchText, setSearchText] = useState('');

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(employee => {
      // 区域筛选
      const regionMatch = region === 'national' || employee.region === region || employee.region === 'national';
      
      // 搜索筛选
      const searchMatch = !searchText || 
        employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase()));
      
      // 时间可用性筛选
      const timeMatch = employee.availability.some(avail => 
        avail.start <= timeRange.end && avail.end >= timeRange.start
      );
      
      return regionMatch && searchMatch && timeMatch;
    });
  }, [region, searchText, timeRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#52c41a';
      case 'partial': return '#faad14';
      case 'busy': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return '完全空闲';
      case 'partial': return '部分空闲';
      case 'busy': return '忙碌';
      default: return '未知';
    }
  };

  return (
    <div className="resource-pool">
      <div className="pool-header">
        <Title level={4} className="pool-title">
          <UserOutlined /> 人力资源池
        </Title>
        <Badge count={filteredEmployees.length} className="employee-count" />
      </div>
      
      <div className="pool-search">
        <Search
          placeholder="搜索员工姓名、部门、技能..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      
      <div className="employee-list">
        {filteredEmployees.map(employee => (
          <Card
            key={employee.id}
            className="employee-card"
            size="small"
            hoverable
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify(employee));
            }}
          >
            <div className="employee-info">
              <div className="employee-header">
                <Avatar 
                  src={employee.avatar} 
                  icon={<UserOutlined />}
                  className="employee-avatar"
                />
                <div className="employee-basic">
                  <Text strong className="employee-name">{employee.name}</Text>
                  <Text className="employee-position">{employee.position}</Text>
                </div>
                <div className="employee-status">
                  <Badge 
                    color={getStatusColor(employee.availability[0]?.status)} 
                    text={getStatusText(employee.availability[0]?.status)}
                  />
                </div>
              </div>
              
              <div className="employee-details">
                <div className="employee-department">
                  <Text type="secondary">{employee.department}</Text>
                </div>
                
                <div className="employee-skills">
                  {employee.skills.slice(0, 2).map(skill => (
                    <Tag key={skill} size="small" color="blue">{skill}</Tag>
                  ))}
                  {employee.skills.length > 2 && (
                    <Tooltip title={employee.skills.slice(2).join(', ')}>
                      <Tag size="small">+{employee.skills.length - 2}</Tag>
                    </Tooltip>
                  )}
                </div>
                
                <div className="employee-meta">
                  <Space size="small">
                    <Text type="secondary" className="meta-item">
                      <ClockCircleOutlined /> {employee.currentProjects}个项目
                    </Text>
                    <Text type="secondary" className="meta-item">
                      ⭐ {employee.rating}
                    </Text>
                  </Space>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <Text type="secondary">暂无符合条件的员工</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePool;