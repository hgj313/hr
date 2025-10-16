import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectTimeline from '../components/ProjectTimeline';
import TimeRangeSelector from '../components/TimeRangeSelector';
import TimePrecisionController from '../components/TimePrecisionController';
import PrimaryTimeSelector from '../components/PrimaryTimeSelector';
import SecondaryTimeSelector from '../components/SecondaryTimeSelector';
import EmployeeResourcePool from '../components/EmployeeResourcePool';
import { mockEmployees, mockProjects, mockRegions } from '../data/mockData';
import './RegionDashboard.css';

interface Project {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  employeeCount: number;
  progress: number;
}

type TimePrecision = 'day' | 'week' | 'month' | 'quarter' | 'year';

const RegionDashboard: React.FC = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31'
  });
  const [timePrecision, setTimePrecision] = useState<TimePrecision>('month');
  const [projects, setProjects] = useState<Project[]>([]);
  
  // 新增状态
  const [primaryTimeRange, setPrimaryTimeRange] = useState<[string, string]>(['2024-01-01', '2024-06-30']);
  const [primaryPrecision, setPrimaryPrecision] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [secondaryTimeRanges, setSecondaryTimeRanges] = useState<Array<{
    id: string;
    start: string;
    end: string;
    color: string;
    label: string;
  }>>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // 区域名称映射
  const regionNames: Record<string, string> = {
    'nationwide': '全国',
    'central-china': '华中',
    'south-china': '华南',
    'east-china': '华东',
    'north-china': '华北'
  };

  // 加载Mock数据
  useEffect(() => {
    // 根据区域过滤项目
    const regionData = mockRegions.find(r => r.code === regionId || r.id === regionId);
    if (regionData) {
      setProjects(regionData.projects.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        startDate: p.startDate,
        endDate: p.endDate,
        status: p.status,
        priority: p.priority,
        employeeCount: p.employeeCount,
        progress: p.progress
      })));
    } else {
      // 如果是全国视图，显示所有项目
      setProjects(mockProjects.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        startDate: p.startDate,
        endDate: p.endDate,
        status: p.status,
        priority: p.priority,
        employeeCount: p.employeeCount,
        progress: p.progress
      })));
    }
  }, [regionId]);

  const handleProjectDoubleClick = (projectId: string) => {
    navigate(`/region/${regionId}/project/${projectId}`);
  };

  const handleBackToRegions = () => {
    navigate('/');
  };

  // 新增事件处理函数
  const handleEmployeeSelect = (employee: any) => {
    setSelectedEmployee(employee);
    console.log('选中员工:', employee);
  };

  const handleEmployeeDragStart = (employee: any) => {
    console.log('开始拖拽员工:', employee);
  };

  const handleEmployeeDrop = (projectId: string, employeeData: any) => {
    console.log('员工拖拽到项目:', { projectId, employeeData });
    // 这里可以添加实际的员工分配逻辑
    // 例如：调用API将员工分配到项目
    alert(`员工 ${employeeData.name} 已分配到项目！`);
  };

  const handlePrimaryTimeRangeChange = (range: [string, string]) => {
    setPrimaryTimeRange(range);
    // 同步更新旧的时间范围选择器
    setSelectedTimeRange({ start: range[0], end: range[1] });
  };

  // 获取当前区域的员工
  const getCurrentRegionEmployees = () => {
    const regionData = mockRegions.find(r => r.code === regionId || r.id === regionId);
    return regionData ? regionData.employees : mockEmployees;
  };

  const regionName = regionNames[regionId || ''] || '未知区域';

  return (
    <div className="region-dashboard">
      {/* 页面头部 */}
      <div className="dashboard-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToRegions}>
            ← 返回区域选择
          </button>
          <div className="region-info">
            <h1>{regionName}区域项目管理</h1>
            <div className="region-stats">
              <span className="stat">项目总数: {projects.length}</span>
              <span className="stat">进行中: {projects.filter(p => p.status === 'ongoing').length}</span>
              <span className="stat">已完成: {projects.filter(p => p.status === 'completed').length}</span>
            </div>
          </div>
        </div>
        
        {/* 时间范围和精度控制 */}
        <div className="time-controls">
          <div className="time-controls-section">
            <h4>项目时间轴控制</h4>
            <PrimaryTimeSelector
              timeRange={primaryTimeRange}
              precision={primaryPrecision}
              onTimeRangeChange={handlePrimaryTimeRangeChange}
              onPrecisionChange={setPrimaryPrecision}
            />
          </div>
          
          <div className="time-controls-section">
            <h4>人力资源筛选</h4>
            <SecondaryTimeSelector
              timeRanges={secondaryTimeRanges}
              onTimeRangesChange={setSecondaryTimeRanges}
            />
          </div>
          
          {/* 保留原有控制器作为备用 */}
          <div className="time-controls-section legacy-controls" style={{ display: 'none' }}>
            <TimeRangeSelector
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
            />
            <TimePrecisionController
              value={timePrecision}
              onChange={setTimePrecision}
              options={['day', 'week', 'month', 'quarter', 'year']}
            />
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 上方人力资源池 - 横向布局 */}
        <div className="resource-pool-section">
          <div className="resource-pool-header">
            <h3>人力资源池</h3>
          </div>
          <div className="resource-pool-content">
             <EmployeeResourcePool
               employees={getCurrentRegionEmployees()}
               selectedRegion={regionId || 'nationwide'}
               timeFilters={secondaryTimeRanges}
               onEmployeeSelect={handleEmployeeSelect}
               onEmployeeDragStart={handleEmployeeDragStart}
             />
           </div>
        </div>

        {/* 下方项目时间轴区域 - 占满整个宽度 */}
        <div className="timeline-section">
          <div className="timeline-header">
            <h3>项目时间轴</h3>
            <div className="timeline-legend">
              <span className="legend-item">
                <span className="legend-color ongoing"></span>
                进行中
              </span>
              <span className="legend-item">
                <span className="legend-color completed"></span>
                已完成
              </span>
              <span className="legend-item">
                <span className="legend-color planning"></span>
                计划中
              </span>
            </div>
          </div>
          <div className="timeline-content">
            <ProjectTimeline
              projects={projects}
              timeRange={selectedTimeRange}
              precision={timePrecision}
              onProjectDoubleClick={handleProjectDoubleClick}
              onEmployeeDrop={handleEmployeeDrop}
            />
          </div>
        </div>
      </div>

      {/* 项目列表概览 */}
      <div className="projects-overview">
        <h3>项目概览</h3>
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`project-card ${project.priority}`}
              onDoubleClick={() => handleProjectDoubleClick(project.id)}
            >
              <div className="project-header">
                <h4>{project.name}</h4>
                <span className={`status ${project.status}`}>
                  {project.status === 'ongoing' ? '进行中' : 
                   project.status === 'completed' ? '已完成' : 
                   project.status === 'planning' ? '计划中' : '暂停'}
                </span>
              </div>
              <div className="project-details">
                <p>类型: {project.type}</p>
                <p>人员: {project.employeeCount}人</p>
                <p>进度: {project.progress}%</p>
                <p>时间: {project.startDate} ~ {project.endDate}</p>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionDashboard;