"""
时间轴布局算法单元测试
"""
import pytest
from datetime import datetime, timedelta
from algorithms.timeline_layout import TimelineLayoutEngine
from models.assignment import Assignment


class TestTimelineLayoutEngine:
    """时间轴布局引擎测试类"""
    
    def test_generate_employee_timeline_basic(self, db_session, sample_employee, sample_project, sample_user):
        """测试基本的员工时间轴生成"""
        # 创建一个分配
        assignment = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 17, 0),
            status="assigned",
            notes="测试分配",
            created_by=sample_user.id
        )
        db_session.add(assignment)
        db_session.commit()
        
        engine = TimelineLayoutEngine(db_session)
        
        # 生成时间轴
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 15, 0, 0),
            datetime(2024, 1, 15, 23, 59),
            "hour"
        )
        
        assert "error" not in timeline
        assert timeline["employee"]["id"] == sample_employee.id
        assert timeline["employee"]["name"] == sample_employee.name
        assert len(timeline["timeline_items"]) == 1
        
        item = timeline["timeline_items"][0]
        assert item["assignment_id"] == assignment.id
        assert item["project_name"] == sample_project.name
        assert item["duration_hours"] == 9  # 8点到17点
        assert item["layout"]["row"] == 0
    
    def test_generate_employee_timeline_with_overlaps(self, db_session, sample_employee, sample_project, sample_user):
        """测试有重叠的员工时间轴生成"""
        # 创建两个重叠的分配
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
            start_time=datetime(2024, 1, 15, 10, 0),
            end_time=datetime(2024, 1, 15, 14, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add_all([assignment1, assignment2])
        db_session.commit()
        
        engine = TimelineLayoutEngine(db_session)
        
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 15, 0, 0),
            datetime(2024, 1, 15, 23, 59),
            "hour"
        )
        
        assert len(timeline["timeline_items"]) == 2
        
        # 检查重叠解析：两个项目应该在不同的行
        items = timeline["timeline_items"]
        rows = [item["layout"]["row"] for item in items]
        assert len(set(rows)) == 2  # 应该有两个不同的行
        assert timeline["statistics"]["max_concurrent_assignments"] == 2
    
    def test_time_grid_generation(self, db_session, sample_employee):
        """测试时间网格生成"""
        engine = TimelineLayoutEngine(db_session)
        
        # 测试小时级别的时间网格
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 15, 8, 0),
            datetime(2024, 1, 15, 12, 0),
            "hour"
        )
        
        time_grid = timeline["time_grid"]
        assert len(time_grid) == 4  # 8-9, 9-10, 10-11, 11-12
        
        # 检查第一个时间段
        first_slot = time_grid[0]
        assert first_slot["start"] == datetime(2024, 1, 15, 8, 0)
        assert first_slot["end"] == datetime(2024, 1, 15, 9, 0)
        assert first_slot["label"] == "08:00"
        assert first_slot["is_weekend"] is False  # 2024-01-15是周一
    
    def test_weekend_detection(self, db_session, sample_employee):
        """测试周末检测"""
        engine = TimelineLayoutEngine(db_session)
        
        # 2024-01-13是周六
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 13, 8, 0),
            datetime(2024, 1, 13, 12, 0),
            "hour"
        )
        
        time_grid = timeline["time_grid"]
        # 所有时间段都应该标记为周末
        for slot in time_grid:
            assert slot["is_weekend"] is True
    
    def test_generate_project_timeline(self, db_session, sample_employee, sample_project, sample_user):
        """测试项目时间轴生成"""
        # 创建项目分配
        assignment = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 17, 0),
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment)
        db_session.commit()
        
        engine = TimelineLayoutEngine(db_session)
        
        timeline = engine.generate_project_timeline(
            sample_project.id,
            datetime(2024, 1, 15, 0, 0),
            datetime(2024, 1, 15, 23, 59),
            "hour"
        )
        
        assert "error" not in timeline
        assert timeline["project"]["id"] == sample_project.id
        assert timeline["project"]["name"] == sample_project.name
        assert len(timeline["employee_timelines"]) == 1
        
        employee_timeline = timeline["employee_timelines"][0]
        assert employee_timeline["employee"]["id"] == sample_employee.id
        assert len(employee_timeline["timeline_items"]) == 1
    
    def test_partial_assignment_handling(self, db_session, sample_employee, sample_project, sample_user):
        """测试部分分配的处理（分配时间超出视图范围）"""
        # 创建一个超出视图范围的分配
        assignment = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 14, 20, 0),  # 前一天晚上开始
            end_time=datetime(2024, 1, 15, 10, 0),    # 当天上午结束
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment)
        db_session.commit()
        
        engine = TimelineLayoutEngine(db_session)
        
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 15, 0, 0),   # 当天开始
            datetime(2024, 1, 15, 23, 59), # 当天结束
            "hour"
        )
        
        assert len(timeline["timeline_items"]) == 1
        
        item = timeline["timeline_items"][0]
        assert item["is_partial"] is True  # 应该标记为部分分配
        assert item["actual_start"] == datetime(2024, 1, 15, 0, 0)  # 视图开始时间
        assert item["actual_end"] == datetime(2024, 1, 15, 10, 0)   # 原始结束时间
        assert item["duration_hours"] == 10  # 0点到10点
    
    def test_timeline_statistics(self, db_session, sample_employee, sample_project, sample_user):
        """测试时间轴统计信息"""
        # 创建分配
        assignment = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 8, 0),
            end_time=datetime(2024, 1, 15, 12, 0),  # 4小时
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment)
        db_session.commit()
        
        engine = TimelineLayoutEngine(db_session)
        
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 15, 0, 0),
            datetime(2024, 1, 15, 23, 59),  # 24小时视图
            "hour"
        )
        
        stats = timeline["statistics"]
        assert stats["total_hours"] == pytest.approx(23.98, rel=1e-2)  # 接近24小时
        assert stats["assigned_hours"] == 4
        assert stats["utilization_rate"] == pytest.approx(16.67, rel=1e-2)  # 4/24 * 100
        assert stats["assignment_count"] == 1
        assert stats["max_concurrent_assignments"] == 1
    
    def test_layout_percentage_calculation(self, db_session, sample_employee, sample_project, sample_user):
        """测试布局百分比计算"""
        # 创建一个分配
        assignment = Assignment(
            employee_id=sample_employee.id,
            project_id=sample_project.id,
            start_time=datetime(2024, 1, 15, 6, 0),   # 6点开始
            end_time=datetime(2024, 1, 15, 12, 0),    # 12点结束，6小时
            status="assigned",
            created_by=sample_user.id
        )
        db_session.add(assignment)
        db_session.commit()
        
        engine = TimelineLayoutEngine(db_session)
        
        # 12小时视图：0点到12点
        timeline = engine.generate_employee_timeline(
            sample_employee.id,
            datetime(2024, 1, 15, 0, 0),
            datetime(2024, 1, 15, 12, 0),
            "hour"
        )
        
        item = timeline["timeline_items"][0]
        layout = item["layout"]
        
        # 6点开始，在12小时视图中应该是50%位置
        assert layout["start_percentage"] == 50.0
        # 6小时持续时间，在12小时视图中应该是50%宽度
        assert layout["width_percentage"] == 50.0