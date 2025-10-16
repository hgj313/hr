"""
时间冲突检测算法单元测试
"""
import pytest
from datetime import datetime, timedelta
from algorithms.conflict_detection import ConflictDetector
from models.assignment import Assignment


class TestConflictDetector:
    """冲突检测器测试类"""
    
    def test_no_conflict(self, db_session, sample_employee, sample_project, sample_user):
        """测试无冲突情况"""
        # 创建一个分配
        assignment1 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 12, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment1)
        db_session.commit()
        
        detector = ConflictDetector(db_session)
        
        # 测试不冲突的时间段
        result = detector.check_employee_conflict(
            sample_employee.id,
            datetime(2024, 1, 15, 13, 0),  # 下午1点开始
            datetime(2024, 1, 15, 17, 0)   # 下午5点结束
        )
        
        assert result["has_conflict"] is False
        assert result["conflict_count"] == 0
        assert len(result["conflicts"]) == 0
        assert result["total_overlap_hours"] == 0
    
    def test_full_overlap_conflict(self, db_session, sample_employee, sample_project, sample_user):
        """测试完全重叠冲突"""
        # 创建一个分配
        assignment1 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 17, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment1)
        db_session.commit()
        
        detector = ConflictDetector(db_session)
        
        # 测试完全重叠的时间段
        result = detector.check_employee_conflict(
            sample_employee.id,
            datetime(2024, 1, 15, 9, 0),   # 上午9点开始
            datetime(2024, 1, 15, 16, 0)   # 下午4点结束
        )
        
        assert result["has_conflict"] is True
        assert result["conflict_count"] == 1
        assert len(result["conflicts"]) == 1
        assert result["total_overlap_hours"] == 7  # 9点到16点，7小时
        
        conflict = result["conflicts"][0]
        assert conflict["assignment_id"] == assignment1.id
        assert conflict["overlap_hours"] == 7
        assert conflict["overlap_percentage"] == 100  # 完全重叠
    
    def test_partial_overlap_conflict(self, db_session, sample_employee, sample_project, sample_user):
        """测试部分重叠冲突"""
        # 创建一个分配
        assignment1 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 12, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment1)
        db_session.commit()
        
        detector = ConflictDetector(db_session)
        
        # 测试部分重叠的时间段
        result = detector.check_employee_conflict(
            sample_employee.id,
            datetime(2024, 1, 15, 10, 0),  # 上午10点开始
            datetime(2024, 1, 15, 14, 0)   # 下午2点结束
        )
        
        assert result["has_conflict"] is True
        assert result["conflict_count"] == 1
        assert result["total_overlap_hours"] == 2  # 10点到12点，2小时
        
        conflict = result["conflicts"][0]
        assert conflict["overlap_hours"] == 2
        assert conflict["overlap_percentage"] == 50  # 4小时中的2小时
    
    def test_multiple_conflicts(self, db_session, sample_employee, sample_project, sample_user):
        """测试多个冲突"""
        # 创建多个分配
        assignment1 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 10, 0),
            status="assigned",
            created_by=sample_user.id
        )
        assignment2 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 14, 0),
            end_time=datetime(2024, 1, 15, 16, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add_all([assignment1, assignment2])
        db_session.commit()
        
        detector = ConflictDetector(db_session)
        
        # 测试与两个分配都冲突的时间段
        result = detector.check_employee_conflict(
            sample_employee.id,
            datetime(2024, 1, 15, 9, 0),   # 上午9点开始
            datetime(2024, 1, 15, 15, 0)   # 下午3点结束
        )
        
        assert result["has_conflict"] is True
        assert result["conflict_count"] == 2
        assert len(result["conflicts"]) == 2
        assert result["total_overlap_hours"] == 2  # 1小时 + 1小时
    
    def test_exclude_assignment(self, db_session, sample_employee, sample_project, sample_user):
        """测试排除指定分配"""
        # 创建一个分配
        assignment1 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 12, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment1)
        db_session.commit()
        
        detector = ConflictDetector(db_session)
        
        # 测试排除该分配后的冲突检测
        result = detector.check_employee_conflict(
            sample_employee.id,
            datetime(2024, 1, 15, 9, 0),
            datetime(2024, 1, 15, 11, 0),
            exclude_assignment_id=assignment1.id
        )
        
        assert result["has_conflict"] is False
        assert result["conflict_count"] == 0
    
    def test_get_employee_availability(self, db_session, sample_employee, sample_project, sample_user):
        """测试获取员工可用时间"""
        # 创建分配：上午8-12点，下午2-5点
        assignment1 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 12, 0),
            status="assigned",
            created_by=sample_user.id
        )
        assignment2 = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 14, 0),
            end_time=datetime(2024, 1, 15, 17, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add_all([assignment1, assignment2])
        db_session.commit()
        
        detector = ConflictDetector(db_session)
        
        # 获取当天的可用时间
        availability = detector.get_employee_availability(
            sample_employee.id,
            datetime(2024, 1, 15, 0, 0),
            datetime(2024, 1, 15, 23, 59)
        )
        
        # 应该有3个可用时间段：0-8点，12-14点，17-23:59点
        assert len(availability) == 3
        
        # 检查中午的可用时间段
        noon_slot = next(slot for slot in availability if slot["start_time"].hour == 12)
        assert noon_slot["duration_hours"] == 2  # 12点到14点
    
    def test_batch_conflict_check(self, db_session, sample_employee, sample_project, sample_user):
        """测试批量冲突检测"""
        # 创建现有分配
        existing_assignment = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 9, 0),
            end_time=datetime(2024, 1, 15, 13, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(existing_assignment)
        db_session.flush()
        
        detector = ConflictDetector(db_session)
        
        # 批量检测单个员工的多个分配
        employee_assignments = [
            {
                "employee_id": sample_employee.id,
                "start_time": datetime(2024, 1, 15, 10, 0),  # 冲突
                "end_time": datetime(2024, 1, 15, 14, 0)
            },
            {
                "employee_id": sample_employee.id,
                "start_time": datetime(2024, 1, 15, 15, 0),  # 不冲突
                "end_time": datetime(2024, 1, 15, 17, 0)
            }
        ]
        
        result = detector.check_multiple_employees_conflict(employee_assignments)
        
        # 修正期望值：只有1个员工，有冲突
        assert result["total_employees"] == 1
        assert result["employees_with_conflicts"] == 1
        assert result["conflict_rate"] == 1.0
        assert sample_employee.id in result["details"]
        assert result["details"][sample_employee.id]["has_conflict"] is True