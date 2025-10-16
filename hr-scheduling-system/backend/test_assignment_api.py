"""
任务分配API测试脚本
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/v1"


def test_assignment_crud():
    """测试任务分配CRUD操作"""
    print("=== 测试任务分配API ===")
    
    # 首先确保有员工和项目数据
    print("\n0. 准备测试数据:")
    
    # 创建员工
    employee_data = {
        "name": "测试员工2",
        "phone": "13800138001",
        "email": "test2@example.com",
        "department": "技术部",
        "position": "开发工程师",
        "status": "active"
    }
    employee_response = requests.post(f"{BASE_URL}/employees/", json=employee_data)
    if employee_response.status_code == 201:
        employee_id = employee_response.json()["id"]
        print(f"创建员工成功，ID: {employee_id}")
    else:
        print("员工创建失败，使用默认ID 1")
        employee_id = 1
    
    # 创建项目
    project_data = {
        "name": "测试项目2",
        "description": "任务分配测试项目",
        "status": "active",
        "priority": "medium"
    }
    project_response = requests.post(f"{BASE_URL}/projects/", json=project_data)
    if project_response.status_code == 201:
        project_id = project_response.json()["id"]
        print(f"创建项目成功，ID: {project_id}")
    else:
        print("项目创建失败，使用默认ID 1")
        project_id = 1
    
    # 1. 获取任务分配列表
    print("\n1. 获取任务分配列表:")
    response = requests.get(f"{BASE_URL}/assignments/")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 2. 创建任务分配
    print("\n2. 创建任务分配:")
    now = datetime.now()
    start_time = now + timedelta(days=1)
    end_time = start_time + timedelta(hours=8)
    
    assignment_data = {
        "employee_id": employee_id,
        "project_id": project_id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "status": "assigned",
        "notes": "测试任务分配"
    }
    response = requests.post(f"{BASE_URL}/assignments/", json=assignment_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 201:
        created_assignment = response.json()
        print(f"响应: {created_assignment}")
        assignment_id = created_assignment["id"]
        
        # 3. 获取单个任务分配
        print(f"\n3. 获取任务分配 ID {assignment_id}:")
        response = requests.get(f"{BASE_URL}/assignments/{assignment_id}")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 4. 更新任务分配
        print(f"\n4. 更新任务分配 ID {assignment_id}:")
        update_data = {
            "status": "in_progress",
            "notes": "任务进行中"
        }
        response = requests.put(f"{BASE_URL}/assignments/{assignment_id}", json=update_data)
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 5. 测试冲突检测
        print(f"\n5. 测试冲突检测:")
        conflict_start = start_time + timedelta(hours=2)
        conflict_end = conflict_start + timedelta(hours=4)
        
        params = {
            "employee_id": employee_id,
            "start_time": conflict_start.isoformat(),
            "end_time": conflict_end.isoformat()
        }
        response = requests.get(f"{BASE_URL}/assignments/conflicts/check", params=params)
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 6. 测试筛选功能
        print(f"\n6. 测试员工筛选:")
        response = requests.get(f"{BASE_URL}/assignments/?employee_id={employee_id}")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
    else:
        try:
            print(f"测试出错: {response.json()}")
        except:
            print(f"测试出错: {response.text}")


def test_conflict_creation():
    """测试创建冲突的任务分配"""
    print("\n=== 测试冲突检测 ===")
    
    # 尝试创建冲突的任务分配
    now = datetime.now()
    start_time = now + timedelta(days=1)
    end_time = start_time + timedelta(hours=4)
    
    assignment_data = {
        "employee_id": 1,  # 假设员工1已存在
        "project_id": 1,   # 假设项目1已存在
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "status": "assigned",
        "notes": "冲突测试"
    }
    
    response = requests.post(f"{BASE_URL}/assignments/", json=assignment_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 400:
        print(f"冲突检测成功: {response.json()}")
    else:
        print(f"响应: {response.json()}")


def test_health_check():
    """测试健康检查"""
    print("=== 测试健康检查 ===")
    response = requests.get(f"{BASE_URL.replace('/api/v1', '')}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")


if __name__ == "__main__":
    try:
        test_health_check()
        test_assignment_crud()
        test_conflict_creation()
    except requests.exceptions.ConnectionError:
        print("错误: 无法连接到API服务器，请确保服务器正在运行")
    except Exception as e:
        print(f"测试出错: {e}")