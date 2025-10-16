import React, { useState, useMemo } from 'react';
import { Card, Typography, Tag, Progress, Avatar, Space, Input, Badge, Tooltip, Button, Modal, message } from 'antd';
import { ProjectOutlined, SearchOutlined, TeamOutlined, CalendarOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import './ProjectPool.css';

const { Text, Title } = Typography;
const { Search } = Input;

interface TimeRange {
  start: Date;
  end: Date;
  granularity: 'week' | 'month' | 'year';
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  skills: string[];
  avatar?: string;
  assignedDuration: number; // 分配天数
  assignedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planning' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  requiredSkills: string[];
  region: string;
  maxTeamSize: number;
  assignedEmployees: Employee[];
  progress: number;
  budget: number;
}

interface ProjectPoolProps {
  region: string;
  timeRange: TimeRange;
}

// 模拟项目数据
const mockProjects: Project[] = [
  {
    id: '1',
    name: '电商平台重构',
    description: '对现有电商平台进行技术重构，提升性能和用户体验',
    priority: 'high',
    status: 'planning',
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    region: 'east',
    maxTeamSize: 8,
    assignedEmployees: [],
    progress: 0,
    budget: 500000
  },
  {
    id: '2',
    name: '移动端APP开发',
    description: '开发企业级移动端应用，支持iOS和Android平台',
    priority: 'medium',
    status: 'active',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    requiredSkills: ['React Native', 'Flutter', 'UI设计'],
    region: 'south',
    maxTeamSize: 6,
    assignedEmployees: [
      {
        id: '1',
        name: '张三',
        department: '技术部',
        position: '高级工程师',
        skills: ['React', 'Node.js'],
        assignedDuration: 3,
        assignedAt: new Date()
      }
    ],
    progress: 25,
    budget: 300000
  },
  {
    id: '3',
    name: '数据分析平台',
    description: '构建企业数据分析和可视化平台',
    priority: 'high',
    status: 'planning',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    requiredSkills: ['Python', 'React', '数据分析'],
    region: 'national',
    maxTeamSize: 10,
    assignedEmployees: [],
    progress: 0,
    budget: 800000
  }
];

const ProjectPool: React.FC<ProjectPoolProps> = ({ region, timeRange }) => {
  const [searchText, setSearchText] = useState('');
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 区域筛选
      const regionMatch = region === 'national' || project.region === region || project.region === 'national';
      
      // 搜索筛选
      const searchMatch = !searchText || 
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.description.toLowerCase().includes(searchText.toLowerCase()) ||
        project.requiredSkills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase()));
      
      // 时间范围筛选
      const timeMatch = project.startDate <= timeRange.end && project.endDate >= timeRange.start;
      
      return regionMatch && searchMatch && timeMatch;
    });
  }, [region, searchText, timeRange, projects]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#1890ff';
      case 'active': return '#52c41a';
      case 'completed': return '#722ed1';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return '规划中';
      case 'active': return '进行中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const handleDrop = (e: React.DragEvent, project: Project) => {
    e.preventDefault();
    try {
      const employeeData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // 检查员工是否已经在项目中
      const isAlreadyAssigned = project.assignedEmployees.some(emp => emp.id === employeeData.id);
      if (isAlreadyAssigned) {
        message.warning('该员工已经分配到此项目');
        return;
      }

      // 检查项目是否已满员
      if (project.assignedEmployees.length >= project.maxTeamSize) {
        message.warning('项目团队已满员');
        return;
      }

      // 添加员工到项目
      const newEmployee: Employee = {
        ...employeeData,
        assignedDuration: 3, // 默认3天
        assignedAt: new Date()
      };

      const updatedProjects = projects.map(p => 
        p.id === project.id 
          ? { ...p, assignedEmployees: [...p.assignedEmployees, newEmployee] }
          : p
      );

      setProjects(updatedProjects);
      message.success(`${employeeData.name} 已成功分配到 ${project.name}`);
    } catch (error) {
      message.error('分配失败，请重试');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const showProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const removeEmployee = (projectId: string, employeeId: string) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, assignedEmployees: p.assignedEmployees.filter(emp => emp.id !== employeeId) }
        : p
    );
    setProjects(updatedProjects);
    message.success('员工已从项目中移除');
  };

  return (
    <div className="project-pool">
      <div className="pool-header">
        <Title level={4} className="pool-title">
          <ProjectOutlined /> 项目池
        </Title>
        <Badge count={filteredProjects.length} className="project-count" />
      </div>
      
      <div className="pool-search">
        <Search
          placeholder="搜索项目名称、描述、技能要求..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      
      <div className="project-grid">
        {filteredProjects.map(project => (
          <Card
            key={project.id}
            className="project-card"
            hoverable
            onDrop={(e) => handleDrop(e, project)}
            onDragOver={handleDragOver}
            onClick={() => showProjectDetail(project)}
          >
            <div className="project-header">
              <div className="project-title-section">
                <Title level={5} className="project-name">{project.name}</Title>
                <Space>
                  <Tag color={getPriorityColor(project.priority)}>
                    {project.priority === 'high' ? '高优先级' : 
                     project.priority === 'medium' ? '中优先级' : '低优先级'}
                  </Tag>
                  <Tag color={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Tag>
                </Space>
              </div>
            </div>
            
            <div className="project-description">
              <Text type="secondary">{project.description}</Text>
            </div>
            
            <div className="project-progress">
              <Text className="progress-label">进度</Text>
              <Progress 
                percent={project.progress} 
                size="small" 
                strokeColor={getStatusColor(project.status)}
              />
            </div>
            
            <div className="project-team">
              <div className="team-header">
                <Space>
                  <TeamOutlined />
                  <Text>团队成员</Text>
                  <Badge count={project.assignedEmployees.length} />
                  <Text type="secondary">/ {project.maxTeamSize}</Text>
                </Space>
              </div>
              
              <div className="team-members">
                {project.assignedEmployees.slice(0, 5).map(employee => (
                  <Tooltip key={employee.id} title={`${employee.name} - ${employee.position}`}>
                    <Avatar 
                      size="small" 
                      icon={<UserOutlined />}
                      className="member-avatar"
                    >
                      {employee.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
                {project.assignedEmployees.length > 5 && (
                  <Avatar size="small" className="more-members">
                    +{project.assignedEmployees.length - 5}
                  </Avatar>
                )}
                {project.assignedEmployees.length < project.maxTeamSize && (
                  <div className="add-member-placeholder">
                    <PlusOutlined />
                  </div>
                )}
              </div>
            </div>
            
            <div className="project-meta">
              <Space split={<span>|</span>}>
                <Text type="secondary" className="meta-item">
                  <CalendarOutlined /> {Math.ceil((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24))}天
                </Text>
                <Text type="secondary" className="meta-item">
                  💰 ¥{(project.budget / 10000).toFixed(1)}万
                </Text>
              </Space>
            </div>
            
            <div className="required-skills">
              {project.requiredSkills.slice(0, 3).map(skill => (
                <Tag key={skill} size="small" color="geekblue">{skill}</Tag>
              ))}
              {project.requiredSkills.length > 3 && (
                <Tag size="small">+{project.requiredSkills.length - 3}</Tag>
              )}
            </div>
          </Card>
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <Text type="secondary">暂无符合条件的项目</Text>
          </div>
        )}
      </div>

      {/* 项目详情弹窗 */}
      <Modal
        title={selectedProject?.name}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        className="project-detail-modal"
      >
        {selectedProject && (
          <div className="project-detail">
            <div className="detail-section">
              <Title level={5}>项目描述</Title>
              <Text>{selectedProject.description}</Text>
            </div>
            
            <div className="detail-section">
              <Title level={5}>团队成员 ({selectedProject.assignedEmployees.length}/{selectedProject.maxTeamSize})</Title>
              <div className="member-list">
                {selectedProject.assignedEmployees.map(employee => (
                  <Card key={employee.id} size="small" className="member-card">
                    <div className="member-info">
                      <Avatar icon={<UserOutlined />}>{employee.name.charAt(0)}</Avatar>
                      <div className="member-details">
                        <Text strong>{employee.name}</Text>
                        <Text type="secondary">{employee.position}</Text>
                        <Text type="secondary">分配时长: {employee.assignedDuration}天</Text>
                      </div>
                      <Button 
                        size="small" 
                        danger 
                        onClick={() => removeEmployee(selectedProject.id, employee.id)}
                      >
                        移除
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectPool;