"""
项目模型
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class Project(Base):
    """项目模型"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    location = Column(String(200), nullable=True)  # 项目地点
    region = Column(String(100), nullable=True, index=True)  # 所属区域
    client = Column(String(200), nullable=True)  # 客户名称
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), default="planning", nullable=False)  # planning, active, completed, cancelled
    priority = Column(String(20), default="medium", nullable=False)  # low, medium, high, urgent
    budget = Column(String(50), nullable=True)  # 预算（字符串格式，避免精度问题）
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    assignments = relationship("Assignment", back_populates="project")
    
    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}', status='{self.status}')>"
    
    @property
    def is_active(self) -> bool:
        """检查项目是否活跃"""
        return self.status in ["planning", "active"]
    
    @property
    def duration_days(self) -> int:
        """计算项目持续天数"""
        if not self.start_date or not self.end_date:
            return 0
        return (self.end_date - self.start_date).days + 1
    
    def get_assigned_employees_count(self) -> int:
        """获取分配的员工数量"""
        return len([a for a in self.assignments if a.is_active])