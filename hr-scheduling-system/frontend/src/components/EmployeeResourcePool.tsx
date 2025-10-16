import React, { useState, useMemo } from 'react';
import { Typography, Input, Select, Badge, Tooltip, Card, Avatar, Tag } from 'antd';
import { SearchOutlined, UserOutlined, FilterOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Employee } from '../data/mockData';
import EmployeeDetailModal from './EmployeeDetailModal';

const { Text, Title } = Typography;
const { Search } = Input;

interface EmployeeResourcePoolProps {
  employees: Employee[];
  selectedRegion: string;
  timeFilters: Array<{
    start: string;
    end: string;
    color: string;
    label: string;
  }>;
  onEmployeeSelect?: (employee: Employee) => void;
  onEmployeeDragStart?: (employee: Employee) => void;
}

const EmployeeResourcePool: React.FC<EmployeeResourcePoolProps> = ({
  employees,
  selectedRegion,
  timeFilters,
  onEmployeeSelect,
  onEmployeeDragStart
}) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'busy'>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 获取所有技能列表
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    employees.forEach(emp => emp.skills.forEach(skill => skills.add(skill)));
    return Array.from(skills);
  }, [employees]);

  // 过滤员工
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // 区域过滤
      if (selectedRegion !== 'nationwide' && employee.region !== selectedRegion) {
        return false;
      }

      // 搜索过滤
      if (searchText && !employee.name.toLowerCase().includes(searchText.toLowerCase()) &&
          !employee.role.toLowerCase().includes(searchText.toLowerCase()) &&
          !employee.department.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      // 状态过滤
      if (statusFilter === 'available' && !employee.isAvailable) return false;
      if (statusFilter === 'busy' && employee.isAvailable) return false;

      // 技能过滤
      if (skillFilter !== 'all' && !employee.skills.includes(skillFilter)) {
        return false;
      }

      return true;
    });
  }, [employees, selectedRegion, searchText, statusFilter, skillFilter]);

  const handleEmployeeClick = (employee: Employee) => {
    onEmployeeSelect?.(employee);
  };

  const handleEmployeeDetailClick = (e: React.MouseEvent, employee: Employee) => {
    e.stopPropagation(); // 阻止事件冒泡
    setSelectedEmployeeForDetail(employee);
    setDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedEmployeeForDetail(null);
  };

  const handleDragStart = (e: React.DragEvent, employee: Employee) => {
    e.dataTransfer.setData('application/json', JSON.stringify(employee));
    onEmployeeDragStart?.(employee);
  };

  const getEmployeeStatusColor = (employee: Employee) => {
    if (employee.isAvailable) return 'green';
    return 'red';
  };

  const getEmployeeStatusText = (employee: Employee) => {
    if (employee.isAvailable) return '可用';
    return '忙碌';
  };

  // 处理横向滚动 - 只在悬停状态下生效
  const handleWheel = (e: React.WheelEvent) => {
    if (!isHovered) return; // 只在悬停状态下处理滚轮事件
    
    const container = e.currentTarget as HTMLElement;
    // 阻止默认的垂直滚动行为和事件冒泡
    e.preventDefault();
    e.stopPropagation();
    // 将垂直滚动转换为横向滚动
    container.scrollLeft += e.deltaY;
  };

  // 鼠标进入人力资源池区域
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // 鼠标离开人力资源池区域
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="employee-resource-pool-horizontal flex bg-white rounded-lg shadow-sm border">
      {/* 左侧控制区域 */}
      <div className="resource-pool-controls flex-shrink-0 w-80 p-4 border-r bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <Title level={5} className="m-0 flex items-center">
            <UserOutlined className="mr-2 text-blue-500" />
            人力资源池
          </Title>
          <Badge count={filteredEmployees.length} showZero color="blue" />
        </div>

        {/* 搜索框 */}
        <Search
          placeholder="搜索员工姓名、职位、部门"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
          size="small"
        />

        {/* 过滤器 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Text className="text-xs text-gray-500 w-12">状态:</Text>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              size="small"
              className="flex-1"
            >
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="available">可用</Select.Option>
              <Select.Option value="busy">忙碌</Select.Option>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Text className="text-xs text-gray-500 w-12">技能:</Text>
            <Select
              value={skillFilter}
              onChange={setSkillFilter}
              size="small"
              className="flex-1"
              placeholder="选择技能"
            >
              <Select.Option value="all">全部技能</Select.Option>
              {allSkills.map(skill => (
                <Select.Option key={skill} value={skill}>{skill}</Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mt-4 p-3 bg-white rounded border text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>可用: {filteredEmployees.filter(e => e.isAvailable).length}</span>
            <span>忙碌: {filteredEmployees.filter(e => !e.isAvailable).length}</span>
          </div>
          <div className="text-center font-medium">
            总计: {filteredEmployees.length}
          </div>
        </div>
      </div>

      {/* 右侧员工卡片横向滚动区域 */}
      <div className="employee-cards-container flex-1 p-4">
        {filteredEmployees.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <UserOutlined className="text-2xl mb-2" />
              <div>暂无符合条件的员工</div>
            </div>
          </div>
        ) : (
          <div 
            className={`employee-cards-scroll h-full transition-all duration-300 ${
              isHovered ? 'bg-blue-50 border-2 border-blue-200 shadow-lg' : 'bg-transparent'
            }`}
            onWheel={handleWheel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex space-x-4 h-full pb-2">
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  size="small"
                  className="employee-card-horizontal cursor-pointer hover:shadow-md transition-shadow relative flex-shrink-0 w-64"
                  draggable
                  onDragStart={(e) => handleDragStart(e, employee)}
                  onClick={() => handleEmployeeClick(employee)}
                  bodyStyle={{ padding: '12px' }}
                >
                  {/* 详情按钮 */}
                  <Tooltip title="查看详细信息">
                    <div
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-10"
                      onClick={(e) => handleEmployeeDetailClick(e, employee)}
                    >
                      <InfoCircleOutlined className="text-xs" />
                    </div>
                  </Tooltip>

                  <div className="flex flex-col h-full">
                    {/* 员工基本信息 */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="relative flex-shrink-0">
                        <Avatar size={40} className="bg-blue-500">
                          {employee.avatar || employee.name.charAt(0)}
                        </Avatar>
                        <Badge
                          status={employee.isAvailable ? 'success' : 'error'}
                          className="absolute -bottom-1 -right-1"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Text strong className="text-sm truncate">
                            {employee.name}
                          </Text>
                          <Badge
                            color={getEmployeeStatusColor(employee)}
                            text={getEmployeeStatusText(employee)}
                            className="text-xs"
                          />
                        </div>
                        
                        <div className="text-xs text-gray-500 truncate mb-1">
                          {employee.role}
                        </div>
                        
                        <div className="text-xs text-gray-400 truncate">
                          {employee.department}
                        </div>
                      </div>
                    </div>
                    
                    {/* 技能标签 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {employee.skills.slice(0, 4).map((skill, index) => (
                        <Tag key={index} size="small" className="text-xs" color="blue">
                          {skill}
                        </Tag>
                      ))}
                      {employee.skills.length > 4 && (
                        <Tooltip title={employee.skills.slice(4).join(', ')}>
                          <Tag size="small" className="text-xs" color="default">
                            +{employee.skills.length - 4}
                          </Tag>
                        </Tooltip>
                      )}
                    </div>

                    {/* 当前任务信息 */}
                    {!employee.isAvailable && employee.timeline.length > 0 && (
                      <div className="mt-auto p-2 bg-red-50 rounded text-xs border-l-2 border-red-200">
                        <Text className="text-red-600 font-medium">
                          正在执行: {employee.timeline[0].projectName}
                        </Text>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 员工详细信息弹窗 */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        visible={detailModalVisible}
        onClose={handleDetailModalClose}
      />
    </div>
  );
};

export default EmployeeResourcePool;