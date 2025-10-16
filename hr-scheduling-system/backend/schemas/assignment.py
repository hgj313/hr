"""
任务分配相关的Pydantic schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class AssignmentBase(BaseModel):
    """任务分配基础schema"""
    employee_id: int
    project_id: int
    start_time: datetime
    end_time: datetime
    status: str = "assigned"
    notes: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    """创建任务分配schema"""
    created_by: Optional[int] = None


class AssignmentUpdate(BaseModel):
    """更新任务分配schema"""
    employee_id: Optional[int] = None
    project_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    """任务分配响应schema"""
    id: int
    created_by: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AssignmentWithDetails(AssignmentResponse):
    """包含详细信息的任务分配schema"""
    employee_name: Optional[str] = None
    project_name: Optional[str] = None
    duration_hours: Optional[float] = None
    duration_days: Optional[int] = None