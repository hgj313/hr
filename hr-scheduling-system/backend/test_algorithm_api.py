"""
算法API测试脚本
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/v1"


def test_conflict_detection():
    """测试冲突检测API"""
    print("=== 测试冲突检测API ===")
    
    # 1. 单员工冲突检测
    print("\n1. 单员工冲突检测:")
    now = datetime.now()
    start_time = now + timedelta(days=1)
    end_time = start_time + timedelta(hours=4)
    
    conflict_data = {
        "employee_id": 1,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat()
    }
    
    response = requests.post(f"{BASE_URL}/algorithms/conflicts/check", json=conflict_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        print(f"响应: {response.json()}")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")
    
    # 2. 多员工冲突检测
    print("\n2. 多员工冲突检测:")
    multi_conflict_data = {
        "employee_assignments": [
            {
                "employee_id": 1,
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat()
            },
            {
                "employee_id": 2,
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat()
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/algorithms/conflicts/check-multiple", json=multi_conflict_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        print(f"响应: {response.json()}")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")


def test_availability_check():
    """测试可用性检查API"""
    print("\n=== 测试可用性检查API ===")
    
    now = datetime.now()
    start_date = now
    end_date = now + timedelta(days=7)
    
    availability_data = {
        "employee_id": 1,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat()
    }
    
    response = requests.post(f"{BASE_URL}/algorithms/availability/check", json=availability_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"可用时间段数量: {len(result.get('available_slots', []))}")
        if result.get('available_slots'):
            print("前3个可用时间段:")
            for i, slot in enumerate(result['available_slots'][:3]):
                print(f"  {i+1}. {slot['start_time']} - {slot['end_time']} ({slot['duration_hours']}小时)")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")


def test_optimal_time_slot():
    """测试最优时间段查找API"""
    print("\n=== 测试最优时间段查找API ===")
    
    now = datetime.now()
    start_date = now + timedelta(days=1)
    end_date = start_date + timedelta(days=7)
    
    optimal_data = {
        "employee_ids": [1, 2],
        "duration_hours": 4.0,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "working_hours": [8, 18]
    }
    
    response = requests.post(f"{BASE_URL}/algorithms/optimal-time/find", json=optimal_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"找到最优时间段: {result['found']}")
        if result['found'] and result['optimal_slot']:
            slot = result['optimal_slot']
            print(f"最优时间段: {slot['start_time']} - {slot['end_time']}")
            print(f"持续时间: {slot['duration_hours']}小时")
            print(f"置信度: {slot['confidence_score']}")
            print(f"可用员工: {slot['available_employees']}")
        elif result['message']:
            print(f"消息: {result['message']}")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")


def test_timeline_apis():
    """测试时间轴API"""
    print("\n=== 测试时间轴API ===")
    
    now = datetime.now()
    start_date = now - timedelta(days=7)
    end_date = now + timedelta(days=7)
    
    # 1. 员工时间轴
    print("\n1. 员工时间轴:")
    params = {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "time_unit": "day"
    }
    
    response = requests.get(f"{BASE_URL}/algorithms/timeline/employee/1", params=params)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"员工信息: {result.get('employee', {})}")
        print(f"时间范围: {result.get('time_range', {})}")
        print(f"时间网格数量: {len(result.get('time_grid', []))}")
        print(f"时间轴项目数量: {len(result.get('timeline_items', []))}")
        print(f"统计信息: {result.get('statistics', {})}")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")
    
    # 2. 项目时间轴
    print("\n2. 项目时间轴:")
    response = requests.get(f"{BASE_URL}/algorithms/timeline/project/1", params=params)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"项目信息: {result.get('project', {})}")
        print(f"时间范围: {result.get('time_range', {})}")
        print(f"时间网格数量: {len(result.get('time_grid', []))}")
        employee_timelines = result.get('employee_timelines', [])
        print(f"员工时间轴数量: {len(employee_timelines) if employee_timelines else 0}")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")
    
    # 3. 部门时间轴
    print("\n3. 部门时间轴:")
    response = requests.get(f"{BASE_URL}/algorithms/timeline/department/技术部", params=params)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"部门信息: {result.get('department', '')}")
        print(f"时间范围: {result.get('time_range', {})}")
        print(f"时间网格数量: {len(result.get('time_grid', []))}")
        employee_timelines = result.get('employee_timelines', [])
        print(f"员工时间轴数量: {len(employee_timelines) if employee_timelines else 0}")
    else:
        try:
            print(f"错误: {response.json()}")
        except:
            print(f"错误: {response.text}")


def test_health_check():
    """测试健康检查"""
    print("=== 测试健康检查 ===")
    response = requests.get(f"{BASE_URL.replace('/api/v1', '')}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")


if __name__ == "__main__":
    try:
        test_health_check()
        test_conflict_detection()
        test_availability_check()
        test_optimal_time_slot()
        test_timeline_apis()
    except requests.exceptions.ConnectionError:
        print("错误: 无法连接到API服务器，请确保服务器正在运行")
    except Exception as e:
        print(f"测试出错: {e}")