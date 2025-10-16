"""
项目相关的Pydantic schemas
"""
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel


class ProjectBase(BaseModel):
    """项目基础schema"""
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None
    client: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str = "planning"
    priority: str = "medium"
    budget: Optional[str] = None


class ProjectCreate(ProjectBase):
    """创建项目schema"""
    pass


class ProjectUpdate(BaseModel):
    """更新项目schema"""
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None
    client: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    budget: Optional[str] = None


class ProjectResponse(ProjectBase):
    """项目响应schema"""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True