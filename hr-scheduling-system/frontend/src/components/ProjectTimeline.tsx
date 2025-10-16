import React, { useState, useMemo } from 'react';
import { Project as BaseProject } from '../types';
import './ProjectTimeline.css';

interface ProjectTimelineProject extends BaseProject {
  type?: string;
  startDate?: string;
  endDate?: string;
  employeeCount?: number;
  progress?: number;
}

interface TimeRange {
  start: string;
  end: string;
}

interface ProjectTimelineProps {
  projects: ProjectTimelineProject[];
  timeRange: TimeRange;
  precision: 'day' | 'week' | 'month' | 'quarter' | 'year';
  onProjectDoubleClick: (projectId: string) => void;
  onEmployeeDrop?: (projectId: string, employeeData: any) => void;
}

interface TimelineProject extends ProjectTimelineProject {
  startPos: number;
  width: number;
  row: number;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projects,
  timeRange,
  precision,
  onProjectDoubleClick,
  onEmployeeDrop
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dragOverProject, setDragOverProject] = useState<string | null>(null);

  // 计算当前时间在时间轴上的位置
  const currentTimePosition = useMemo(() => {
    const now = new Date();
    const timelineStart = new Date(timeRange.start);
    const timelineEnd = new Date(timeRange.end);
    
    // 检查当前时间是否在时间轴范围内
    if (now < timelineStart || now > timelineEnd) {
      return null; // 当前时间不在显示范围内
    }
    
    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
    const currentOffset = now.getTime() - timelineStart.getTime();
    const position = (currentOffset / totalDuration) * 100;
    
    return Math.max(0, Math.min(100, position)); // 确保在0-100%范围内
  }, [timeRange]);

  // 处理横向滚动 - 只在悬停状态下生效
  const handleWheel = (e: React.WheelEvent) => {
    if (!isHovered) return; // 只在悬停状态下处理滚轮事件
    
    // 找到可滚动的容器
    const scrollContainer = e.currentTarget.querySelector('.timeline-scroll-container') as HTMLElement;
    if (scrollContainer) {
      // 阻止默认的垂直滚动行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      // 将垂直滚动转换为横向滚动
      scrollContainer.scrollLeft += e.deltaY;
    }
  };

  // 鼠标进入项目时间轴区域
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // 鼠标离开项目时间轴区域
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // 生成时间刻度
  const timeScale = useMemo(() => {
    const start = new Date(timeRange.start);
    const end = new Date(timeRange.end);
    const scales: { date: Date; label: string }[] = [];
    
    let current = new Date(start);
    
    while (current <= end) {
      let label = '';
      let next = new Date(current);
      
      switch (precision) {
        case 'day':
          label = `${current.getMonth() + 1}/${current.getDate()}`;
          next.setDate(current.getDate() + 1);
          break;
        case 'week':
          const weekStart = new Date(current);
          weekStart.setDate(current.getDate() - current.getDay());
          label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
          next.setDate(current.getDate() + 7);
          break;
        case 'month':
          label = `${current.getFullYear()}/${current.getMonth() + 1}`;
          next.setMonth(current.getMonth() + 1);
          break;
        case 'quarter':
          const quarter = Math.floor(current.getMonth() / 3) + 1;
          label = `${current.getFullYear()}Q${quarter}`;
          next.setMonth(current.getMonth() + 3);
          break;
        case 'year':
          label = `${current.getFullYear()}`;
          next.setFullYear(current.getFullYear() + 1);
          break;
      }
      
      scales.push({ date: new Date(current), label });
      current = next;
    }
    
    return scales;
  }, [timeRange, precision]);

  // 计算项目在时间轴上的位置和排布
  const arrangedProjects = useMemo(() => {
    const timelineStart = new Date(timeRange.start);
    const timelineEnd = new Date(timeRange.end);
    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
    
    // 过滤在时间范围内的项目
    const visibleProjects = projects.filter(project => {
      const projectStart = new Date(project.startDate || project.start_date || '');
      const projectEnd = new Date(project.endDate || project.end_date || '');
      return projectStart <= timelineEnd && projectEnd >= timelineStart;
    });
    
    // 计算每个项目的位置和宽度
    const projectsWithPosition = visibleProjects.map(project => {
      const projectStart = new Date(project.startDate || project.start_date || '');
      const projectEnd = new Date(project.endDate || project.end_date || '');
      
      // 确保项目时间在时间轴范围内
      const clampedStart = new Date(Math.max(projectStart.getTime(), timelineStart.getTime()));
      const clampedEnd = new Date(Math.min(projectEnd.getTime(), timelineEnd.getTime()));
      
      const startPos = ((clampedStart.getTime() - timelineStart.getTime()) / totalDuration) * 100;
      const endPos = ((clampedEnd.getTime() - timelineStart.getTime()) / totalDuration) * 100;
      const width = endPos - startPos;
      
      return {
        ...project,
        startPos,
        width,
        row: 0 // 初始行号，后续会重新计算
      };
    });
    
    // 智能排布算法 - 处理时间重叠
    const arrangedProjects: TimelineProject[] = [];
    
    // 按开始时间排序
    projectsWithPosition.sort((a, b) => a.startPos - b.startPos);
    
    for (const project of projectsWithPosition) {
      let assignedRow = 0;
      let canPlaceInRow = false;
      
      // 寻找可以放置的行
      while (!canPlaceInRow) {
        canPlaceInRow = true;
        
        // 检查当前行是否有重叠
        for (const existingProject of arrangedProjects) {
          if (existingProject.row === assignedRow) {
            const existingEnd = existingProject.startPos + existingProject.width;
            const projectEnd = project.startPos + project.width;
            
            // 检查是否有重叠（留出一点间隙）
            if (!(project.startPos >= existingEnd + 0.5 || projectEnd <= existingProject.startPos - 0.5)) {
              canPlaceInRow = false;
              break;
            }
          }
        }
        
        if (!canPlaceInRow) {
          assignedRow++;
        }
      }
      
      arrangedProjects.push({
        ...project,
        row: assignedRow
      });
    }
    
    return arrangedProjects;
  }, [projects, timeRange, precision]);

  const maxRows = Math.max(...arrangedProjects.map(p => p.row), 0) + 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return '#3b82f6';
      case 'completed': return '#22c55e';
      case 'planning': return '#f59e0b';
      case 'paused': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityClass = (priority: string) => {
    return `priority-${priority}`;
  };

  return (
    <div 
      className={`project-timeline transition-all duration-300 ${
        isHovered ? 'bg-blue-50 border-2 border-blue-200 shadow-lg' : 'bg-transparent'
      }`}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 统一的滚动容器 */}
      <div className={`timeline-scroll-container precision-${precision}`}>
        {/* 时间刻度 */}
        <div className="timeline-scale">
          {timeScale.map((scale, index) => (
            <div 
              key={index}
              className="scale-item"
              style={{ 
                left: `${(index / (timeScale.length - 1)) * 100}%`,
                width: `${100 / (timeScale.length - 1)}%`
              }}
            >
              <div className="scale-line"></div>
              <div className="scale-label">{scale.label}</div>
            </div>
          ))}
        </div>
        
        {/* 项目排布区域 */}
        <div 
          className="timeline-content"
          style={{ height: `${Math.max(maxRows * 60 + 40, 200)}px` }}
        >
        {arrangedProjects.map((project) => (
          <div
            key={project.id}
            className={`project-bar ${getPriorityClass(project.priority)} ${
              dragOverProject === project.id ? 'drag-over' : ''
            }`}
            style={{
              left: `${project.startPos}%`,
              width: `${project.width}%`,
              top: `${project.row * 60 + 20}px`,
              backgroundColor: getStatusColor(project.status)
            }}
            onDoubleClick={() => onProjectDoubleClick(project.id)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverProject(project.id);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOverProject(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverProject(null);
              const employeeData = e.dataTransfer.getData('application/json');
              if (employeeData && onEmployeeDrop) {
                onEmployeeDrop(project.id, JSON.parse(employeeData));
              }
            }}
            title={`${project.name} (${project.startDate || project.start_date || ''} ~ ${project.endDate || project.end_date || ''})`}
          >
            <div className="project-content">
              <div className="project-name">{project.name}</div>
              <div className="project-info">
                <span className="project-type">{project.type || '项目'}</span>
                <span className="project-employees">{project.employeeCount || 0}人</span>
                <span className="project-progress">{project.progress || 0}%</span>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="project-progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* 空状态 */}
        {arrangedProjects.length === 0 && (
          <div className="empty-timeline">
            <p>当前时间范围内没有项目</p>
          </div>
        )}
        
        {/* 当前时间指针 */}
        {currentTimePosition !== null && (
          <div 
            className="current-time-pointer"
            style={{ left: `${currentTimePosition}%` }}
            title={`当前时间: ${new Date().toLocaleString('zh-CN')}`}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;