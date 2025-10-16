"""
员工相关的Pydantic schemas
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class EmployeeBase(BaseModel):
    """员工基础schema"""
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    position: Optional[str] = None
    skills: Optional[str] = None  # JSON字符串存储技能列表
    status: str = "active"


class EmployeeCreate(EmployeeBase):
    """创建员工schema"""
    pass


class EmployeeUpdate(BaseModel):
    """更新员工schema"""
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    position: Optional[str] = None
    skills: Optional[str] = None
    status: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    """员工响应schema"""
    id: int
    user_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True