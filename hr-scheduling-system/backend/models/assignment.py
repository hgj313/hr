"""
分配模型 - 系统核心模型
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime


class Assignment(Base):
    """员工项目分配模型"""
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    start_time = Column(DateTime(timezone=True), nullable=False, index=True)
    end_time = Column(DateTime(timezone=True), nullable=False, index=True)
    status = Column(String(20), default="assigned", nullable=False)  # assigned, in_progress, completed, cancelled
    notes = Column(Text, nullable=True)  # 备注信息
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # 创建者
    
    # 关系
    employee = relationship("Employee", back_populates="assignments")
    project = relationship("Project", back_populates="assignments")
    creator = relationship("User", foreign_keys=[created_by])
    
    def __repr__(self):
        return f"<Assignment(id={self.id}, employee_id={self.employee_id}, project_id={self.project_id}, status='{self.status}')>"
    
    @property
    def is_active(self) -> bool:
        """检查分配是否活跃"""
        return self.status in ["assigned", "in_progress"]
    
    @property
    def duration_hours(self) -> float:
        """计算分配持续小时数"""
        if not self.start_time or not self.end_time:
            return 0
        delta = self.end_time - self.start_time
        return delta.total_seconds() / 3600
    
    @property
    def duration_days(self) -> int:
        """计算分配持续天数"""
        return int(self.duration_hours / 24) + (1 if self.duration_hours % 24 > 0 else 0)
    
    def overlaps_with(self, other_start: datetime, other_end: datetime) -> bool:
        """检查是否与指定时间段重叠"""
        return not (self.end_time <= other_start or self.start_time >= other_end)
    
    def get_overlap_duration(self, other_start: datetime, other_end: datetime) -> float:
        """计算与指定时间段的重叠小时数"""
        if not self.overlaps_with(other_start, other_end):
            return 0
        
        overlap_start = max(self.start_time, other_start)
        overlap_end = min(self.end_time, other_end)
        delta = overlap_end - overlap_start
        return delta.total_seconds() / 3600
    
    @classmethod
    def check_conflicts(cls, db_session, employee_id: int, start_time: datetime, 
                       end_time: datetime, exclude_assignment_id: int = None) -> list:
        """检查指定员工在指定时间段的冲突分配"""
        query = db_session.query(cls).filter(
            cls.employee_id == employee_id,
            cls.status.in_(["assigned", "in_progress"]),
            cls.start_time < end_time,
            cls.end_time > start_time
        )
        
        if exclude_assignment_id:
            query = query.filter(cls.id != exclude_assignment_id)
        
        return query.all()