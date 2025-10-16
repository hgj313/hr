import React from 'react';
import { Modal, Avatar, Tag, Badge, Descriptions, Timeline, Progress, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { Employee } from '../data/mockData';
import dayjs from 'dayjs';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  visible: boolean;
  onClose: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  visible,
  onClose
}) => {
  if (!employee) return null;

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'success' : 'error';
  };

  const getStatusText = (isAvailable: boolean) => {
    return isAvailable ? '可用' : '忙碌';
  };

  // 计算工作负载
  const calculateWorkload = () => {
    const totalDays = 30; // 假设30天周期
    const busyDays = employee.timeline.reduce((acc, task) => {
      const start = dayjs(task.startDate);
      const end = dayjs(task.endDate);
      return acc + end.diff(start, 'day') + 1;
    }, 0);
    return Math.min((busyDays / totalDays) * 100, 100);
  };

  const workload = calculateWorkload();

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <Avatar size={48} className="bg-blue-500">
            {employee.avatar || employee.name.charAt(0)}
          </Avatar>
          <div>
            <div className="text-lg font-semibold">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.role}</div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="employee-detail-modal"
    >
      <div className="space-y-4">
        {/* 基本信息 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-medium mb-0">基本信息</h4>
            <Badge
              status={getStatusColor(employee.isAvailable)}
              text={getStatusText(employee.isAvailable)}
              className="text-sm"
            />
          </div>
          
          <Descriptions column={2} size="small">
            <Descriptions.Item label="姓名">{employee.name}</Descriptions.Item>
            <Descriptions.Item label="职位">{employee.role}</Descriptions.Item>
            <Descriptions.Item label="部门">{employee.department}</Descriptions.Item>
            <Descriptions.Item label="所属区域">{employee.region}</Descriptions.Item>
            <Descriptions.Item label="员工ID">{employee.id}</Descriptions.Item>
            <Descriptions.Item label="入职时间">
              {dayjs(employee.hireDate).format('YYYY-MM-DD')}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* 技能标签 */}
        <div>
          <h4 className="text-base font-medium mb-3">专业技能</h4>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill, index) => (
              <Tag key={index} color="blue" className="mb-1">
                {skill}
              </Tag>
            ))}
          </div>
        </div>

        <Divider />

        {/* 工作负载 */}
        <div>
          <h4 className="text-base font-medium mb-3">工作负载</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>当前负载</span>
              <span>{workload.toFixed(1)}%</span>
            </div>
            <Progress 
              percent={workload} 
              status={workload > 80 ? 'exception' : workload > 60 ? 'active' : 'success'}
              size="small"
            />
            <div className="text-xs text-gray-500">
              基于最近30天的项目安排计算
            </div>
          </div>
        </div>

        <Divider />

        {/* 项目时间线 */}
        <div>
          <h4 className="text-base font-medium mb-3">
            <CalendarOutlined className="mr-2" />
            项目时间线
          </h4>
          {employee.timeline.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              暂无项目安排
            </div>
          ) : (
            <Timeline size="small">
              {employee.timeline.map((task, index) => {
                const isOngoing = dayjs().isBetween(dayjs(task.startDate), dayjs(task.endDate), 'day', '[]');
                const isPast = dayjs().isAfter(dayjs(task.endDate));
                
                return (
                  <Timeline.Item
                    key={index}
                    color={isOngoing ? 'blue' : isPast ? 'gray' : 'green'}
                    dot={isOngoing ? <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> : undefined}
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{task.projectName}</div>
                      <div className="text-xs text-gray-500">
                        {task.role} · {dayjs(task.startDate).format('MM-DD')} 至 {dayjs(task.endDate).format('MM-DD')}
                      </div>
                      {isOngoing && (
                        <Tag size="small" color="processing">进行中</Tag>
                      )}
                      {isPast && (
                        <Tag size="small" color="default">已完成</Tag>
                      )}
                      {!isOngoing && !isPast && (
                        <Tag size="small" color="warning">计划中</Tag>
                      )}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          )}
        </div>

        {/* 联系信息 */}
        {(employee.email || employee.phone) && (
          <>
            <Divider />
            <div>
              <h4 className="text-base font-medium mb-3">联系方式</h4>
              <div className="space-y-2">
                {employee.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MailOutlined className="text-gray-400" />
                    <span>{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <PhoneOutlined className="text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EmployeeDetailModal;