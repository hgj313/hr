"""
算法API端点
提供冲突检测和时间轴布局算法的API接口
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from api.deps import get_db
from algorithms import ConflictDetector, TimelineLayoutEngine
from schemas.algorithm import (
    ConflictCheckRequest, ConflictCheckResponse,
    MultipleConflictCheckRequest, MultipleConflictCheckResponse,
    TimelineRequest, TimelineResponse,
    AvailabilityRequest, AvailabilityResponse,
    OptimalTimeSlotRequest, OptimalTimeSlotResponse
)

router = APIRouter()


@router.get("/health")
async def algorithm_health_check():
    """算法服务健康检查"""
    return {"status": "healthy", "service": "algorithms"}


@router.post("/conflicts/check", response_model=ConflictCheckResponse)
async def check_single_conflict(
    request: ConflictCheckRequest,
    db: Session = Depends(get_db)
):
    """检查单个员工时间冲突"""
    try:
        detector = ConflictDetector(db)
        result = detector.check_employee_conflict(
            employee_id=request.employee_id,
            start_time=request.start_time,
            end_time=request.end_time,
            exclude_assignment_id=request.exclude_assignment_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/conflicts/check-multiple", response_model=MultipleConflictCheckResponse)
async def check_multiple_conflicts(
    request: MultipleConflictCheckRequest,
    db: Session = Depends(get_db)
):
    """检查多个员工时间冲突"""
    try:
        detector = ConflictDetector(db)
        
        # 将Pydantic模型转换为字典列表
        processed_assignments = []
        for assignment in request.employee_assignments:
            assignment_dict = {
                "employee_id": assignment.employee_id,
                "start_time": assignment.start_time,
                "end_time": assignment.end_time
            }
            processed_assignments.append(assignment_dict)
        
        result = detector.check_multiple_employees_conflict(processed_assignments)
        return MultipleConflictCheckResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/availability/check", response_model=AvailabilityResponse)
async def check_availability(
    request: AvailabilityRequest,
    db: Session = Depends(get_db)
):
    """检查员工可用性"""
    try:
        detector = ConflictDetector(db)
        
        availability = detector.get_employee_availability(
            request.employee_id,
            request.start_date,
            request.end_date
        )
        
        return AvailabilityResponse(available_slots=availability)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimal-time/find", response_model=OptimalTimeSlotResponse)
def find_optimal_time_slot(
    request: OptimalTimeSlotRequest,
    db: Session = Depends(get_db)
):
    """寻找最优时间段"""
    detector = ConflictDetector(db)
    
    optimal_slot = detector.find_optimal_time_slot(
        request.employee_ids,
        request.duration_hours,
        request.start_date,
        request.end_date,
        request.working_hours
    )
    
    if optimal_slot:
        return OptimalTimeSlotResponse(
            found=True,
            optimal_slot=optimal_slot
        )
    else:
        return OptimalTimeSlotResponse(
            found=False,
            message="未找到合适的时间段"
        )


@router.get("/timeline/employee/{employee_id}", response_model=TimelineResponse)
def get_employee_timeline(
    employee_id: int,
    start_date: datetime = Query(..., description="开始日期"),
    end_date: datetime = Query(..., description="结束日期"),
    time_unit: str = Query("day", description="时间单位: hour, day, week"),
    db: Session = Depends(get_db)
):
    """获取员工时间轴"""
    engine = TimelineLayoutEngine(db)
    
    timeline = engine.generate_employee_timeline(
        employee_id, start_date, end_date, time_unit
    )
    
    if "error" in timeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=timeline["error"]
        )
    
    return TimelineResponse(**timeline)


@router.get("/timeline/project/{project_id}", response_model=TimelineResponse)
def get_project_timeline(
    project_id: int,
    start_date: datetime = Query(..., description="开始日期"),
    end_date: datetime = Query(..., description="结束日期"),
    time_unit: str = Query("day", description="时间单位: hour, day, week"),
    db: Session = Depends(get_db)
):
    """获取项目时间轴"""
    engine = TimelineLayoutEngine(db)
    
    timeline = engine.generate_project_timeline(
        project_id, start_date, end_date, time_unit
    )
    
    if "error" in timeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=timeline["error"]
        )
    
    return TimelineResponse(**timeline)


@router.get("/timeline/department/{department}", response_model=TimelineResponse)
def get_department_timeline(
    department: str,
    start_date: datetime = Query(..., description="开始日期"),
    end_date: datetime = Query(..., description="结束日期"),
    time_unit: str = Query("day", description="时间单位: hour, day, week"),
    db: Session = Depends(get_db)
):
    """获取部门时间轴概览"""
    engine = TimelineLayoutEngine(db)
    
    timeline = engine.generate_department_overview(
        department, start_date, end_date, time_unit
    )
    
    return TimelineResponse(**timeline)