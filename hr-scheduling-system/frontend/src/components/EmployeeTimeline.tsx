import React, { useMemo } from 'react';
import './EmployeeTimeline.css';

interface DispatchRecord {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  role: string;
  dispatchOrder: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  skills: string[];
  avatar?: string;
  dispatchRecords: DispatchRecord[];
}

interface TimeRange {
  start: string;
  end: string;
}

interface EmployeeTimelineProps {
  employees: Employee[];
  timeRange: TimeRange;
  precision: 'hour' | 'day' | 'week' | 'month';
  projectStartDate: string;
  projectEndDate: string;
}

interface TimelineEmployee extends Employee {
  cards: EmployeeCard[];
}

interface EmployeeCard {
  id: string;
  employee: Employee;
  record: DispatchRecord;
  startPos: number;
  width: number;
  row: number;
}

const EmployeeTimeline: React.FC<EmployeeTimelineProps> = ({
  employees,
  timeRange,
  precision,
  projectStartDate,
  projectEndDate
}) => {
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
        case 'hour':
          label = `${current.getMonth() + 1}/${current.getDate()} ${current.getHours()}:00`;
          next.setHours(current.getHours() + 1);
          break;
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
      }
      
      scales.push({ date: new Date(current), label });
      current = next;
    }
    
    return scales;
  }, [timeRange, precision]);

  // 计算员工卡片的智能排布
  const arrangedEmployees = useMemo(() => {
    const timelineStart = new Date(timeRange.start);
    const timelineEnd = new Date(timeRange.end);
    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
    
    // 创建所有员工卡片
    const allCards: EmployeeCard[] = [];
    
    employees.forEach(employee => {
      employee.dispatchRecords.forEach(record => {
        const recordStart = new Date(record.startDate);
        const recordEnd = new Date(record.endDate);
        
        // 检查是否在时间范围内
        if (recordStart <= timelineEnd && recordEnd >= timelineStart) {
          const clampedStart = new Date(Math.max(recordStart.getTime(), timelineStart.getTime()));
          const clampedEnd = new Date(Math.min(recordEnd.getTime(), timelineEnd.getTime()));
          
          const startPos = ((clampedStart.getTime() - timelineStart.getTime()) / totalDuration) * 100;
          const endPos = ((clampedEnd.getTime() - timelineStart.getTime()) / totalDuration) * 100;
          const width = endPos - startPos;
          
          allCards.push({
            id: `${employee.id}-${record.id}`,
            employee,
            record,
            startPos,
            width,
            row: 0 // 初始行号
          });
        }
      });
    });
    
    // 智能排布算法
    const arrangedCards: EmployeeCard[] = [];
    
    // 按派遣顺序排序（这是关键的排布依据）
    allCards.sort((a, b) => a.record.dispatchOrder - b.record.dispatchOrder);
    
    for (const card of allCards) {
      let assignedRow = 0;
      let canPlaceInRow = false;
      
      // 寻找可以放置的行
      while (!canPlaceInRow) {
        canPlaceInRow = true;
        
        // 检查当前行是否有时间重叠
        for (const existingCard of arrangedCards) {
          if (existingCard.row === assignedRow) {
            const existingEnd = existingCard.startPos + existingCard.width;
            const cardEnd = card.startPos + card.width;
            
            // 检查是否有时间重叠（留出间隙）
            if (!(card.startPos >= existingEnd + 0.5 || cardEnd <= existingCard.startPos - 0.5)) {
              canPlaceInRow = false;
              break;
            }
          }
        }
        
        if (!canPlaceInRow) {
          assignedRow++;
        }
      }
      
      arrangedCards.push({
        ...card,
        row: assignedRow
      });
    }
    
    // 按员工分组
    const employeeGroups: TimelineEmployee[] = employees.map(employee => ({
      ...employee,
      cards: arrangedCards.filter(card => card.employee.id === employee.id)
    }));
    
    return { arrangedCards, employeeGroups };
  }, [employees, timeRange, precision]);

  const maxRows = Math.max(...arrangedEmployees.arrangedCards.map(c => c.row), 0) + 1;

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      '项目负责人': '#8b5cf6',
      '技术指导': '#06b6d4',
      '设计师': '#f59e0b',
      '施工员': '#10b981',
      '质检员': '#ef4444',
      '设备操作': '#6b7280'
    };
    return colors[role] || '#6b7280';
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  };

  return (
    <div className="employee-timeline">
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
      
      {/* 员工卡片排布区域 */}
      <div 
        className="timeline-content"
        style={{ height: `${Math.max(maxRows * 70 + 40, 250)}px` }}
      >
        {arrangedEmployees.arrangedCards.map((card) => (
          <div
            key={card.id}
            className="employee-card"
            style={{
              left: `${card.startPos}%`,
              width: `${card.width}%`,
              top: `${card.row * 70 + 20}px`,
              backgroundColor: getRoleColor(card.record.role)
            }}
            title={`${card.employee.name} - ${card.record.role} (${card.record.startDate} ~ ${card.record.endDate})`}
          >
            <div className="card-header">
              <div className="employee-avatar">
                {card.employee.avatar ? (
                  <img src={card.employee.avatar} alt={card.employee.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {card.employee.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="employee-basic-info">
                <div className="employee-name">{card.employee.name}</div>
                <div className="employee-position">{card.employee.position}</div>
              </div>
              <div className="dispatch-order">#{card.record.dispatchOrder}</div>
            </div>
            
            <div className="card-body">
              <div className="role-info">
                <span className="role-label">角色:</span>
                <span className="role-value">{card.record.role}</span>
              </div>
              <div className="duration-info">
                <span className="duration-label">时长:</span>
                <span className="duration-value">{formatDuration(card.record.duration)}</span>
              </div>
            </div>
            
            <div className="card-footer">
              <div className="time-range">
                {card.record.startDate} ~ {card.record.endDate}
              </div>
            </div>
          </div>
        ))}
        
        {/* 空状态 */}
        {arrangedEmployees.arrangedCards.length === 0 && (
          <div className="empty-timeline">
            <p>当前时间范围内没有员工派遣记录</p>
          </div>
        )}
      </div>
      
      {/* 员工统计信息 */}
      <div className="timeline-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">参与员工:</span>
            <span className="stat-value">{arrangedEmployees.employeeGroups.length}人</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">派遣记录:</span>
            <span className="stat-value">{arrangedEmployees.arrangedCards.length}条</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">总工时:</span>
            <span className="stat-value">
              {formatDuration(
                arrangedEmployees.arrangedCards.reduce((total, card) => total + card.record.duration, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTimeline;