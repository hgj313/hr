import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeTimeline from '../components/EmployeeTimeline';
import TimePrecisionController from '../components/TimePrecisionController';
import ProjectInfoCard from '../components/ProjectInfoCard';
import './ProjectDetail.css';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  skills: string[];
  avatar?: string;
  dispatchRecords: DispatchRecord[];
}

interface DispatchRecord {
  id: string;
  startDate: string;
  endDate: string;
  duration: number; // 派遣时长（小时）
  role: string; // 在项目中的角色
  dispatchOrder: number; // 派遣顺序
}

interface ProjectInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  budget: number;
  progress: number;
  manager: string;
  client: string;
  requirements: string[];
}

type EmployeeTimePrecision = 'hour' | 'day' | 'week' | 'month';

const ProjectDetail: React.FC = () => {
  const { projectId, regionId } = useParams<{ projectId: string; regionId?: string }>();
  const navigate = useNavigate();
  
  const [timePrecision, setTimePrecision] = useState<EmployeeTimePrecision>('day');
  const [selectedTimeRange, setSelectedTimeRange] = useState({
    start: '2024-01-01',
    end: '2024-03-31'
  });

  // 模拟项目信息数据
  const [projectInfo] = useState<ProjectInfo>({
    id: projectId || 'proj-001',
    name: '智慧城市综合管理平台',
    type: '软件开发',
    description: '基于物联网和大数据技术的智慧城市综合管理平台，包含交通管理、环境监测、公共安全等多个子系统。',
    location: '武汉市',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'ongoing',
    priority: 'high',
    budget: 2800000,
    progress: 45,
    manager: '张建国',
    client: '武汉市政府',
    requirements: [
      '支持10万+并发用户',
      '99.9%系统可用性',
      '符合国家信息安全等级保护三级要求',
      '支持移动端和PC端访问',
      '提供开放API接口'
    ]
  });

  // 模拟员工派遣数据
  const [employees] = useState<Employee[]>([
    {
      id: 'emp-001',
      name: '李明',
      position: '高级前端工程师',
      department: '技术部',
      skills: ['React', 'TypeScript', 'Node.js', 'Vue.js'],
      dispatchRecords: [
        {
          id: 'dispatch-001',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          duration: 240,
          role: '前端架构师',
          dispatchOrder: 1
        },
        {
          id: 'dispatch-002',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          duration: 200,
          role: '技术指导',
          dispatchOrder: 2
        }
      ]
    },
    {
      id: 'emp-002',
      name: '王芳',
      position: 'UI/UX设计师',
      department: '设计部',
      skills: ['Figma', 'Sketch', '用户体验设计', '交互设计'],
      dispatchRecords: [
        {
          id: 'dispatch-003',
          startDate: '2024-01-20',
          endDate: '2024-02-20',
          duration: 160,
          role: '主设计师',
          dispatchOrder: 1
        }
      ]
    },
    {
      id: 'emp-003',
      name: '陈强',
      position: '后端工程师',
      department: '技术部',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
      dispatchRecords: [
        {
          id: 'dispatch-004',
          startDate: '2024-01-25',
          endDate: '2024-04-25',
          duration: 480,
          role: '后端开发',
          dispatchOrder: 1
        }
      ]
    },
    {
      id: 'emp-004',
      name: '刘洋',
      position: '测试工程师',
      department: '质量部',
      skills: ['自动化测试', 'Selenium', 'JMeter', '性能测试'],
      dispatchRecords: [
        {
          id: 'dispatch-005',
          startDate: '2024-02-01',
          endDate: '2024-03-15',
          duration: 280,
          role: '测试负责人',
          dispatchOrder: 1
        }
      ]
    },
    {
      id: 'emp-005',
      name: '赵敏',
      position: '产品经理',
      department: '产品部',
      skills: ['产品规划', '需求分析', 'Axure', '数据分析'],
      dispatchRecords: [
        {
          id: 'dispatch-006',
          startDate: '2024-01-10',
          endDate: '2024-06-30',
          duration: 800,
          role: '产品负责人',
          dispatchOrder: 1
        }
      ]
    }
  ]);

  const handleBackToRegion = () => {
    if (regionId) {
      // 如果有regionId，返回到对应的区域仪表板
      navigate(`/region/${regionId}`);
    } else {
      // 如果没有regionId，返回到区域选择页面
      navigate('/');
    }
  };

  const handleBackToRegionSelection = () => {
    navigate('/');
  };

  return (
    <div className="project-detail">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-navigation">
          <button onClick={handleBackToRegionSelection} className="nav-button">
            ← 返回区域选择
          </button>
          {regionId && (
            <button onClick={handleBackToRegion} className="nav-button">
              ← 返回区域仪表板
            </button>
          )}
          {!regionId && (
            <button onClick={handleBackToRegion} className="nav-button">
              ← 返回首页
            </button>
          )}
        </div>
        
        <div className="header-title">
          <h1>{projectInfo.name}</h1>
          <p>项目详情与员工派遣管理</p>
        </div>
        
        <div className="header-controls">
          <TimePrecisionController
            value={timePrecision}
            onChange={setTimePrecision}
            options={['hour', 'day', 'week', 'month']}
          />
        </div>
      </div>

      {/* 项目信息卡片 */}
      {projectInfo && (
        <ProjectInfoCard project={projectInfo} />
      )}

      {/* 员工时间轴区域 */}
      <div className="employee-timeline-container">
        <div className="timeline-header">
          <h2>员工派遣时间轴</h2>
          <div className="timeline-stats">
            <span className="stat">总人数: {employees.length}</span>
            <span className="stat">
              总工时: {employees.reduce((total, emp) => 
                total + emp.dispatchRecords.reduce((sum, record) => sum + record.duration, 0), 0
              )}小时
            </span>
          </div>
        </div>
        
        <EmployeeTimeline
          employees={employees}
          timeRange={selectedTimeRange}
          precision={timePrecision}
          projectStartDate={projectInfo?.startDate || ''}
          projectEndDate={projectInfo?.endDate || ''}
        />
      </div>

      {/* 员工列表概览 */}
      <div className="employees-overview">
        <h3>员工概览</h3>
        <div className="employees-grid">
          {employees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <div className="employee-header">
                <div className="employee-avatar">
                  {employee.avatar ? (
                    <img src={employee.avatar} alt={employee.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {employee.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="employee-info">
                  <h4>{employee.name}</h4>
                  <p>{employee.position}</p>
                  <p>{employee.department}</p>
                </div>
              </div>
              
              <div className="employee-skills">
                <h5>技能</h5>
                <div className="skills-tags">
                  {employee.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="employee-dispatch">
                <h5>派遣记录</h5>
                {employee.dispatchRecords.map((record) => (
                  <div key={record.id} className="dispatch-record">
                    <div className="record-role">{record.role}</div>
                    <div className="record-time">
                      {record.startDate} ~ {record.endDate}
                    </div>
                    <div className="record-duration">{record.duration}小时</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;