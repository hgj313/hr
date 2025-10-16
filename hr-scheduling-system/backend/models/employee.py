"""
员工模型
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class Employee(Base):
    """员工模型"""
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    skills = Column(Text, nullable=True)  # JSON字符串存储技能列表
    position = Column(String(100), nullable=True)  # 职位
    department = Column(String(100), nullable=True)  # 部门
    status = Column(String(20), default="active", nullable=False)  # active, inactive, on_leave
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # 关联用户账号
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user = relationship("User", backref="employee_profile")
    assignments = relationship("Assignment", back_populates="employee")
    
    def __repr__(self):
        return f"<Employee(id={self.id}, name='{self.name}', status='{self.status}')>"
    
    @property
    def is_active(self) -> bool:
        """检查员工是否在职"""
        return self.status == "active"
    
    @property
    def skill_list(self) -> list:
        """获取技能列表"""
        if not self.skills:
            return []
        try:
            import json
            return json.loads(self.skills)
        except:
            return self.skills.split(",") if self.skills else []
    
    def set_skills(self, skills: list):
        """设置技能列表"""
        import json
        self.skills = json.dumps(skills, ensure_ascii=False)