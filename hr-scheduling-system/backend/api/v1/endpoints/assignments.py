"""任务分配API端点"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from api.deps import get_db
from models.assignment import Assignment
from models.employee import Employee
from models.project import Project
from schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentResponse, AssignmentWithDetails

router = APIRouter()


@router.get("/", response_model=List[AssignmentWithDetails])
def get_assignments(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(100, ge=1, le=1000, description="返回的记录数"),
    employee_id: Optional[int] = Query(None, description="员工ID筛选"),
    project_id: Optional[int] = Query(None, description="项目ID筛选"),
    status: Optional[str] = Query(None, description="状态筛选"),
    db: Session = Depends(get_db)
):
    """获取任务分配列表"""
    query = db.query(Assignment).join(Employee).join(Project)
    
    # 应用筛选条件
    if employee_id:
        query = query.filter(Assignment.employee_id == employee_id)
    if project_id:
        query = query.filter(Assignment.project_id == project_id)
    if status:
        query = query.filter(Assignment.status == status)
    
    # 分页
    assignments = query.offset(skip).limit(limit).all()
    
    # 构建响应数据
    result = []
    for assignment in assignments:
        assignment_dict = {
            **assignment.__dict__,
            "employee_name": assignment.employee.name if assignment.employee else None,
            "project_name": assignment.project.name if assignment.project else None,
            "duration_hours": assignment.duration_hours,
            "duration_days": assignment.duration_days
        }
        result.append(assignment_dict)
    
    return result


@router.get("/{assignment_id}", response_model=AssignmentWithDetails)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """获取单个任务分配"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务分配不存在"
        )
    
    # 构建响应数据
    assignment_dict = {
        **assignment.__dict__,
        "employee_name": assignment.employee.name if assignment.employee else None,
        "project_name": assignment.project.name if assignment.project else None,
        "duration_hours": assignment.duration_hours,
        "duration_days": assignment.duration_days
    }
    
    return assignment_dict


@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db)
):
    """创建新任务分配"""
    # 验证员工是否存在
    employee = db.query(Employee).filter(Employee.id == assignment.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="员工不存在"
        )
    
    # 验证项目是否存在
    project = db.query(Project).filter(Project.id == assignment.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在"
        )
    
    # 验证时间逻辑
    if assignment.start_time >= assignment.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="开始时间必须早于结束时间"
        )
    
    # 检查时间冲突
    conflicts = Assignment.check_conflicts(
        db, assignment.employee_id, assignment.start_time, assignment.end_time
    )
    if conflicts:
        conflict_details = [
            f"项目{c.project_id}: {c.start_time} - {c.end_time}" for c in conflicts
        ]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"员工在该时间段已有分配冲突: {', '.join(conflict_details)}"
        )
    
    # 创建任务分配
    db_assignment = Assignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    assignment_update: AssignmentUpdate,
    db: Session = Depends(get_db)
):
    """更新任务分配"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务分配不存在"
        )
    
    # 获取更新数据
    update_data = assignment_update.dict(exclude_unset=True)
    
    # 如果更新了员工ID，验证员工是否存在
    if "employee_id" in update_data:
        employee = db.query(Employee).filter(Employee.id == update_data["employee_id"]).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="员工不存在"
            )
    
    # 如果更新了项目ID，验证项目是否存在
    if "project_id" in update_data:
        project = db.query(Project).filter(Project.id == update_data["project_id"]).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="项目不存在"
            )
    
    # 如果更新了时间，验证时间逻辑和冲突
    start_time = update_data.get("start_time", assignment.start_time)
    end_time = update_data.get("end_time", assignment.end_time)
    employee_id = update_data.get("employee_id", assignment.employee_id)
    
    if start_time >= end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="开始时间必须早于结束时间"
        )
    
    # 检查时间冲突（排除当前分配）
    conflicts = Assignment.check_conflicts(
        db, employee_id, start_time, end_time, exclude_assignment_id=assignment_id
    )
    if conflicts:
        conflict_details = [
            f"项目{c.project_id}: {c.start_time} - {c.end_time}" for c in conflicts
        ]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"员工在该时间段已有分配冲突: {', '.join(conflict_details)}"
        )
    
    # 更新字段
    for field, value in update_data.items():
        setattr(assignment, field, value)
    
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """删除任务分配"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务分配不存在"
        )
    
    db.delete(assignment)
    db.commit()


@router.get("/conflicts/check")
def check_assignment_conflicts(
    employee_id: int = Query(..., description="员工ID"),
    start_time: str = Query(..., description="开始时间 (ISO格式)"),
    end_time: str = Query(..., description="结束时间 (ISO格式)"),
    exclude_assignment_id: Optional[int] = Query(None, description="排除的分配ID"),
    db: Session = Depends(get_db)
):
    """检查任务分配冲突"""
    from datetime import datetime
    
    try:
        start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="时间格式错误，请使用ISO格式"
        )
    
    conflicts = Assignment.check_conflicts(
        db, employee_id, start_dt, end_dt, exclude_assignment_id
    )
    
    conflict_details = []
    for conflict in conflicts:
        conflict_details.append({
            "assignment_id": conflict.id,
            "project_id": conflict.project_id,
            "project_name": conflict.project.name if conflict.project else None,
            "start_time": conflict.start_time,
            "end_time": conflict.end_time,
            "status": conflict.status
        })
    
    return {
        "has_conflicts": len(conflicts) > 0,
        "conflict_count": len(conflicts),
        "conflicts": conflict_details
    }