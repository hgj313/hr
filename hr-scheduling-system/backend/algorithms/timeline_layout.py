"""
时间轴布局算法
用于生成甘特图和时间轴视图的布局数据
"""
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from models.assignment import Assignment
from models.employee import Employee
from models.project import Project


class TimelineLayoutEngine:
    """时间轴布局引擎"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def generate_employee_timeline(
        self, 
        employee_id: int, 
        start_date: datetime, 
        end_date: datetime,
        time_unit: str = "day"  # "hour", "day", "week"
    ) -> Dict:
        """
        生成单个员工的时间轴布局
        
        Args:
            employee_id: 员工ID
            start_date: 开始日期
            end_date: 结束日期
            time_unit: 时间单位
        
        Returns:
            Dict: 时间轴布局数据
        """
        employee = self.db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return {"error": "员工不存在"}
        
        # 获取时间段内的所有分配
        assignments = self.db.query(Assignment).filter(
            Assignment.employee_id == employee_id,
            Assignment.start_time < end_date,
            Assignment.end_time > start_date
        ).order_by(Assignment.start_time).all()
        
        # 生成时间网格
        time_grid = self._generate_time_grid(start_date, end_date, time_unit)
        
        # 处理分配数据
        timeline_items = []
        for assignment in assignments:
            item = self._process_assignment_for_timeline(assignment, start_date, end_date, time_unit)
            if item:
                timeline_items.append(item)
        
        # 检测重叠并调整布局
        layout_items = self._resolve_overlaps(timeline_items)
        
        return {
            "employee": {
                "id": employee.id,
                "name": employee.name,
                "position": employee.position,
                "department": employee.department
            },
            "time_range": {
                "start": start_date,
                "end": end_date,
                "unit": time_unit
            },
            "time_grid": time_grid,
            "timeline_items": layout_items,
            "statistics": self._calculate_timeline_statistics(layout_items, start_date, end_date)
        }
    
    def generate_project_timeline(
        self, 
        project_id: int, 
        start_date: datetime, 
        end_date: datetime,
        time_unit: str = "day"
    ) -> Dict:
        """
        生成项目的时间轴布局（显示所有参与员工）
        
        Args:
            project_id: 项目ID
            start_date: 开始日期
            end_date: 结束日期
            time_unit: 时间单位
        
        Returns:
            Dict: 项目时间轴布局数据
        """
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"error": "项目不存在"}
        
        # 获取项目的所有分配
        assignments = self.db.query(Assignment).filter(
            Assignment.project_id == project_id,
            Assignment.start_time < end_date,
            Assignment.end_time > start_date
        ).order_by(Assignment.employee_id, Assignment.start_time).all()
        
        # 按员工分组
        employee_timelines = {}
        for assignment in assignments:
            employee_id = assignment.employee_id
            if employee_id not in employee_timelines:
                employee_timelines[employee_id] = {
                    "employee": assignment.employee,
                    "assignments": []
                }
            
            item = self._process_assignment_for_timeline(assignment, start_date, end_date, time_unit)
            if item:
                employee_timelines[employee_id]["assignments"].append(item)
        
        # 生成每个员工的布局
        employee_layouts = []
        for employee_id, data in employee_timelines.items():
            layout_items = self._resolve_overlaps(data["assignments"])
            employee_layouts.append({
                "employee": {
                    "id": data["employee"].id,
                    "name": data["employee"].name,
                    "position": data["employee"].position
                },
                "timeline_items": layout_items
            })
        
        time_grid = self._generate_time_grid(start_date, end_date, time_unit)
        
        return {
            "project": {
                "id": project.id,
                "name": project.name,
                "status": project.status,
                "priority": project.priority
            },
            "time_range": {
                "start": start_date,
                "end": end_date,
                "unit": time_unit
            },
            "time_grid": time_grid,
            "employee_timelines": employee_layouts,
            "statistics": self._calculate_project_statistics(employee_layouts)
        }
    
    def generate_department_overview(
        self, 
        department: str, 
        start_date: datetime, 
        end_date: datetime,
        time_unit: str = "day"
    ) -> Dict:
        """
        生成部门概览时间轴
        
        Args:
            department: 部门名称
            start_date: 开始日期
            end_date: 结束日期
            time_unit: 时间单位
        
        Returns:
            Dict: 部门概览数据
        """
        # 获取部门所有员工
        employees = self.db.query(Employee).filter(
            Employee.department == department,
            Employee.status == "active"
        ).all()
        
        department_data = []
        for employee in employees:
            timeline = self.generate_employee_timeline(
                employee.id, start_date, end_date, time_unit
            )
            if "error" not in timeline:
                department_data.append(timeline)
        
        time_grid = self._generate_time_grid(start_date, end_date, time_unit)
        
        return {
            "department": department,
            "time_range": {
                "start": start_date,
                "end": end_date,
                "unit": time_unit
            },
            "time_grid": time_grid,
            "employee_timelines": department_data,
            "statistics": self._calculate_department_statistics(department_data)
        }
    
    def _generate_time_grid(
        self, 
        start_date: datetime, 
        end_date: datetime, 
        time_unit: str
    ) -> List[Dict]:
        """生成时间网格"""
        grid = []
        current = start_date
        
        if time_unit == "hour":
            delta = timedelta(hours=1)
        elif time_unit == "day":
            delta = timedelta(days=1)
        elif time_unit == "week":
            delta = timedelta(weeks=1)
        else:
            delta = timedelta(days=1)
        
        while current < end_date:
            next_time = current + delta
            grid.append({
                "start": current,
                "end": min(next_time, end_date),
                "label": self._format_time_label(current, time_unit),
                "is_weekend": current.weekday() >= 5 if time_unit in ["day", "hour"] else False
            })
            current = next_time
        
        return grid
    
    def _process_assignment_for_timeline(
        self, 
        assignment: Assignment, 
        view_start: datetime, 
        view_end: datetime,
        time_unit: str
    ) -> Optional[Dict]:
        """处理分配数据为时间轴项目"""
        # 计算在视图范围内的实际时间
        actual_start = max(assignment.start_time, view_start)
        actual_end = min(assignment.end_time, view_end)
        
        if actual_start >= actual_end:
            return None
        
        # 计算位置和宽度（相对于视图范围）
        total_duration = (view_end - view_start).total_seconds()
        start_offset = (actual_start - view_start).total_seconds()
        duration = (actual_end - actual_start).total_seconds()
        
        start_percentage = (start_offset / total_duration) * 100
        width_percentage = (duration / total_duration) * 100
        
        return {
            "id": assignment.id,
            "assignment_id": assignment.id,
            "project_id": assignment.project_id,
            "project_name": assignment.project.name if assignment.project else "未知项目",
            "start_time": assignment.start_time,
            "end_time": assignment.end_time,
            "actual_start": actual_start,
            "actual_end": actual_end,
            "status": assignment.status,
            "notes": assignment.notes,
            "layout": {
                "start_percentage": start_percentage,
                "width_percentage": width_percentage,
                "row": 0  # 将在重叠解析中设置
            },
            "duration_hours": (actual_end - actual_start).total_seconds() / 3600,
            "is_partial": assignment.start_time < view_start or assignment.end_time > view_end
        }
    
    def _resolve_overlaps(self, timeline_items: List[Dict]) -> List[Dict]:
        """解决时间轴项目的重叠问题"""
        if not timeline_items:
            return []
        
        # 按开始时间排序
        sorted_items = sorted(timeline_items, key=lambda x: x["actual_start"])
        
        # 分配行号以避免重叠
        rows = []
        for item in sorted_items:
            # 寻找可以放置的行
            placed = False
            for row_idx, row in enumerate(rows):
                # 检查是否与该行的最后一个项目重叠
                if not row or item["actual_start"] >= row[-1]["actual_end"]:
                    row.append(item)
                    item["layout"]["row"] = row_idx
                    placed = True
                    break
            
            # 如果没有找到合适的行，创建新行
            if not placed:
                rows.append([item])
                item["layout"]["row"] = len(rows) - 1
        
        return sorted_items
    
    def _calculate_timeline_statistics(
        self, 
        timeline_items: List[Dict], 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict:
        """计算时间轴统计信息"""
        total_hours = (end_date - start_date).total_seconds() / 3600
        assigned_hours = sum(item["duration_hours"] for item in timeline_items)
        
        return {
            "total_hours": total_hours,
            "assigned_hours": assigned_hours,
            "utilization_rate": (assigned_hours / total_hours) * 100 if total_hours > 0 else 0,
            "assignment_count": len(timeline_items),
            "max_concurrent_assignments": max((item["layout"]["row"] for item in timeline_items), default=0) + 1
        }
    
    def _calculate_project_statistics(self, employee_layouts: List[Dict]) -> Dict:
        """计算项目统计信息"""
        total_employees = len(employee_layouts)
        total_assignments = sum(len(layout["timeline_items"]) for layout in employee_layouts)
        total_hours = sum(
            sum(item["duration_hours"] for item in layout["timeline_items"])
            for layout in employee_layouts
        )
        
        return {
            "total_employees": total_employees,
            "total_assignments": total_assignments,
            "total_hours": total_hours,
            "average_hours_per_employee": total_hours / total_employees if total_employees > 0 else 0
        }
    
    def _calculate_department_statistics(self, employee_timelines: List[Dict]) -> Dict:
        """计算部门统计信息"""
        total_employees = len(employee_timelines)
        total_utilization = sum(
            timeline["statistics"]["utilization_rate"] 
            for timeline in employee_timelines
        )
        
        return {
            "total_employees": total_employees,
            "average_utilization": total_utilization / total_employees if total_employees > 0 else 0,
            "total_assignments": sum(
                timeline["statistics"]["assignment_count"] 
                for timeline in employee_timelines
            )
        }
    
    def _format_time_label(self, time: datetime, time_unit: str) -> str:
        """格式化时间标签"""
        if time_unit == "hour":
            return time.strftime("%H:%M")
        elif time_unit == "day":
            return time.strftime("%m/%d")
        elif time_unit == "week":
            return f"第{time.isocalendar()[1]}周"
        else:
            return time.strftime("%m/%d")