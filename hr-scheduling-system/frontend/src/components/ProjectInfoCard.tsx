import React from 'react';
import './ProjectInfoCard.css';

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

interface ProjectInfoCardProps {
  project: ProjectInfo;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'planning': '计划中',
      'ongoing': '进行中',
      'completed': '已完成',
      'paused': '暂停'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      'high': '高',
      'medium': '中',
      'low': '低'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  return (
    <div className="project-info-card">
      <div className="card-header">
        <div className="project-title">
          <h1>{project.name}</h1>
          <div className="project-meta">
            <span className={`status ${project.status}`}>
              {getStatusText(project.status)}
            </span>
            <span className={`priority ${project.priority}`}>
              {getPriorityText(project.priority)}优先级
            </span>
            <span className="type">{project.type}</span>
          </div>
        </div>
        <div className="progress-section">
          <div className="progress-text">
            <span className="progress-label">项目进度</span>
            <span className="progress-value">{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="info-grid">
          <div className="info-section">
            <h3>基本信息</h3>
            <div className="info-items">
              <div className="info-item">
                <span className="label">项目描述:</span>
                <span className="value">{project.description}</span>
              </div>
              <div className="info-item">
                <span className="label">项目地点:</span>
                <span className="value">{project.location}</span>
              </div>
              <div className="info-item">
                <span className="label">项目经理:</span>
                <span className="value">{project.manager}</span>
              </div>
              <div className="info-item">
                <span className="label">委托方:</span>
                <span className="value">{project.client}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>时间与预算</h3>
            <div className="info-items">
              <div className="info-item">
                <span className="label">开始时间:</span>
                <span className="value">{project.startDate}</span>
              </div>
              <div className="info-item">
                <span className="label">结束时间:</span>
                <span className="value">{project.endDate}</span>
              </div>
              <div className="info-item">
                <span className="label">项目预算:</span>
                <span className="value budget">{formatCurrency(project.budget)}</span>
              </div>
              <div className="info-item">
                <span className="label">工期:</span>
                <span className="value">
                  {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                </span>
              </div>
            </div>
          </div>

          <div className="info-section requirements">
            <h3>项目要求</h3>
            <ul className="requirements-list">
              {project.requirements.map((requirement, index) => (
                <li key={index} className="requirement-item">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard;