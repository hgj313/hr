"""
算法相关的Pydantic schemas
"""
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field


class ConflictCheckRequest(BaseModel):
    """冲突检测请求"""
    employee_id: Optional[int] = None
    employee_ids: Optional[List[int]] = None
    start_time: datetime
    end_time: datetime
    exclude_assignment_id: Optional[int] = None


class EmployeeAssignment(BaseModel):
    """员工分配"""
    employee_id: int
    start_time: datetime
    end_time: datetime


class MultipleConflictCheckRequest(BaseModel):
    """多员工冲突检测请求"""
    employee_assignments: List[EmployeeAssignment]


class MultipleConflictCheckResponse(BaseModel):
    """多员工冲突检测响应"""
    total_employees: int
    employees_with_conflicts: int
    conflict_rate: float
    details: Dict[int, Any]


class ConflictInfo(BaseModel):
    """冲突信息"""
    assignment_id: int
    project_id: int
    project_name: str
    conflict_start: datetime
    conflict_end: datetime
    overlap_hours: float
    overlap_percentage: float


class ConflictCheckResponse(BaseModel):
    """冲突检查响应"""
    has_conflict: bool
    conflict_count: int
    conflicts: List[ConflictInfo]
    total_overlap_hours: float


class AvailabilityRequest(BaseModel):
    """可用性检查请求"""
    employee_id: int
    start_date: datetime
    end_date: datetime


class AvailabilitySlot(BaseModel):
    """可用时间段"""
    start_time: datetime
    end_time: datetime
    duration_hours: float


class AvailabilityResponse(BaseModel):
    """可用性响应"""
    available_slots: List[AvailabilitySlot]


class OptimalTimeSlotRequest(BaseModel):
    """最优时间段查找请求"""
    employee_ids: List[int]
    duration_hours: float
    start_date: datetime
    end_date: datetime
    working_hours: Tuple[int, int] = (8, 18)


class OptimalTimeSlot(BaseModel):
    """最优时间段"""
    start_time: datetime
    end_time: datetime
    duration_hours: float
    confidence_score: float
    available_employees: List[int]


class OptimalTimeSlotResponse(BaseModel):
    """最优时间段查找响应"""
    found: bool
    optimal_slot: Optional[OptimalTimeSlot] = None
    message: Optional[str] = None


class TimelineRequest(BaseModel):
    """时间轴请求"""
    start_date: datetime
    end_date: datetime
    time_unit: str = "day"


class TimelineItem(BaseModel):
    """时间轴项目"""
    id: int
    title: str
    start_time: datetime
    end_time: datetime
    duration_hours: float
    status: str
    project_id: Optional[int] = None
    project_name: Optional[str] = None
    employee_id: Optional[int] = None
    employee_name: Optional[str] = None
    position: Optional[Dict[str, Any]] = None  # 布局位置信息


class TimelineGrid(BaseModel):
    """时间网格"""
    start: datetime
    end: datetime
    label: str
    is_weekend: bool


class TimelineStatistics(BaseModel):
    """时间轴统计"""
    total_assignments: int
    total_hours: Optional[float] = 0
    utilization_rate: Optional[float] = 0
    peak_concurrent_assignments: Optional[int] = 0


class TimelineResponse(BaseModel):
    """时间轴响应"""
    # 直接匹配算法模块返回的结构
    employee: Optional[Dict[str, Any]] = None
    project: Optional[Dict[str, Any]] = None
    department: Optional[str] = None
    time_range: Dict[str, Any]
    time_grid: List[TimelineGrid]
    timeline_items: Optional[List[Dict[str, Any]]] = None
    employee_timelines: Optional[List[Dict[str, Any]]] = None
    statistics: Dict[str, Any]