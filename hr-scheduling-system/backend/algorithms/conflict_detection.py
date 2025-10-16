"""
时间冲突检测算法
"""
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from models.assignment import Assignment
from models.employee import Employee


class ConflictDetector:
    """时间冲突检测器"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def check_employee_conflict(
        self, 
        employee_id: int, 
        start_time: datetime, 
        end_time: datetime,
        exclude_assignment_id: Optional[int] = None
    ) -> Dict:
        """
        检查指定员工在指定时间段的冲突
        
        Args:
            employee_id: 员工ID
            start_time: 开始时间
            end_time: 结束时间
            exclude_assignment_id: 排除的分配ID（用于更新时）
        
        Returns:
            Dict: 冲突检测结果
        """
        # 获取冲突的分配
        conflicts = Assignment.check_conflicts(
            self.db, employee_id, start_time, end_time, exclude_assignment_id
        )
        
        result = {
            "has_conflict": len(conflicts) > 0,
            "conflict_count": len(conflicts),
            "conflicts": [],
            "total_overlap_hours": 0
        }
        
        for conflict in conflicts:
            overlap_hours = self._calculate_overlap_hours(
                start_time, end_time, conflict.start_time, conflict.end_time
            )
            
            conflict_info = {
                "assignment_id": conflict.id,
                "project_id": conflict.project_id,
                "project_name": conflict.project.name if conflict.project else "未知项目",
                "conflict_start": conflict.start_time,
                "conflict_end": conflict.end_time,
                "overlap_hours": overlap_hours,
                "overlap_percentage": self._calculate_overlap_percentage(
                    start_time, end_time, conflict.start_time, conflict.end_time
                )
            }
            
            result["conflicts"].append(conflict_info)
            result["total_overlap_hours"] += overlap_hours
        
        return result
    
    def check_multiple_employees_conflict(
        self, 
        employee_assignments: List[Dict]
    ) -> Dict:
        """
        批量检查多个员工的时间冲突
        
        Args:
            employee_assignments: 员工分配列表
                [{"employee_id": 1, "start_time": datetime, "end_time": datetime}, ...]
        
        Returns:
            Dict: 批量冲突检测结果
        """
        results = {}
        employees_with_conflicts = set()
        
        for assignment in employee_assignments:
            employee_id = assignment["employee_id"]
            start_time = assignment["start_time"]
            end_time = assignment["end_time"]
            exclude_id = assignment.get("exclude_assignment_id")
            
            conflict_result = self.check_employee_conflict(
                employee_id, start_time, end_time, exclude_id
            )
            
            # 如果员工已经有结果，合并冲突信息
            if employee_id in results:
                if conflict_result["has_conflict"]:
                    results[employee_id]["has_conflict"] = True
                    results[employee_id]["conflicts"].extend(conflict_result["conflicts"])
            else:
                results[employee_id] = conflict_result
            
            if conflict_result["has_conflict"]:
                employees_with_conflicts.add(employee_id)
        
        unique_employees = len(results)
        conflict_count = len(employees_with_conflicts)
        
        return {
            "total_employees": unique_employees,
            "employees_with_conflicts": conflict_count,
            "conflict_rate": conflict_count / unique_employees if unique_employees > 0 else 0,
            "details": results
        }
    
    def get_employee_availability(
        self, 
        employee_id: int, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[Dict]:
        """
        获取员工在指定日期范围内的可用时间段
        
        Args:
            employee_id: 员工ID
            start_date: 开始日期
            end_date: 结束日期
        
        Returns:
            List[Dict]: 可用时间段列表
        """
        # 获取该时间段内的所有分配
        assignments = self.db.query(Assignment).filter(
            Assignment.employee_id == employee_id,
            Assignment.status.in_(["assigned", "in_progress"]),
            Assignment.start_time < end_date,
            Assignment.end_time > start_date
        ).order_by(Assignment.start_time).all()
        
        available_slots = []
        current_time = start_date
        
        for assignment in assignments:
            # 如果当前时间早于分配开始时间，则有可用时间段
            if current_time < assignment.start_time:
                available_slots.append({
                    "start_time": current_time,
                    "end_time": assignment.start_time,
                    "duration_hours": (assignment.start_time - current_time).total_seconds() / 3600
                })
            
            # 更新当前时间为分配结束时间
            current_time = max(current_time, assignment.end_time)
        
        # 检查最后一个分配后是否还有可用时间
        if current_time < end_date:
            available_slots.append({
                "start_time": current_time,
                "end_time": end_date,
                "duration_hours": (end_date - current_time).total_seconds() / 3600
            })
        
        return available_slots
    
    def find_optimal_time_slot(
        self, 
        employee_ids: List[int], 
        duration_hours: float,
        start_date: datetime,
        end_date: datetime,
        working_hours: Tuple[int, int] = (8, 18)  # 工作时间 8:00-18:00
    ) -> Optional[Dict]:
        """
        为多个员工寻找最优的共同可用时间段
        
        Args:
            employee_ids: 员工ID列表
            duration_hours: 需要的持续时间（小时）
            start_date: 搜索开始日期
            end_date: 搜索结束日期
            working_hours: 工作时间范围
        
        Returns:
            Optional[Dict]: 最优时间段信息
        """
        # 获取所有员工的可用时间段
        all_availability = {}
        for employee_id in employee_ids:
            all_availability[employee_id] = self.get_employee_availability(
                employee_id, start_date, end_date
            )
        
        # 寻找共同可用的时间段
        common_slots = self._find_common_time_slots(
            all_availability, duration_hours, working_hours
        )
        
        if not common_slots:
            return None
        
        # 选择最优时间段（最早的）
        optimal_slot = min(common_slots, key=lambda x: x["start_time"])
        
        return {
            "start_time": optimal_slot["start_time"],
            "end_time": optimal_slot["end_time"],
            "duration_hours": duration_hours,
            "available_employees": employee_ids,
            "confidence_score": self._calculate_confidence_score(optimal_slot)
        }
    
    def _calculate_overlap_hours(
        self, 
        start1: datetime, 
        end1: datetime, 
        start2: datetime, 
        end2: datetime
    ) -> float:
        """计算两个时间段的重叠小时数"""
        overlap_start = max(start1, start2)
        overlap_end = min(end1, end2)
        
        if overlap_start >= overlap_end:
            return 0
        
        return (overlap_end - overlap_start).total_seconds() / 3600
    
    def _calculate_overlap_percentage(
        self, 
        start1: datetime, 
        end1: datetime, 
        start2: datetime, 
        end2: datetime
    ) -> float:
        """计算重叠百分比"""
        overlap_hours = self._calculate_overlap_hours(start1, end1, start2, end2)
        total_hours = (end1 - start1).total_seconds() / 3600
        
        if total_hours == 0:
            return 0
        
        return (overlap_hours / total_hours) * 100
    
    def _find_common_time_slots(
        self, 
        all_availability: Dict, 
        duration_hours: float,
        working_hours: Tuple[int, int]
    ) -> List[Dict]:
        """寻找所有员工的共同可用时间段"""
        # 这里实现复杂的时间段交集算法
        # 为了简化，返回空列表，实际项目中需要完整实现
        return []
    
    def _calculate_confidence_score(self, time_slot: Dict) -> float:
        """计算时间段的置信度分数"""
        # 基于多个因素计算置信度：时间段长度、工作时间匹配度等
        return 0.8  # 简化实现