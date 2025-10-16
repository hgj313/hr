"""
项目API测试脚本
"""
import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000/api/v1"


def test_project_crud():
    """测试项目CRUD操作"""
    print("=== 测试项目API ===")
    
    # 1. 获取项目列表
    print("\n1. 获取项目列表:")
    response = requests.get(f"{BASE_URL}/projects/")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 2. 创建项目
    print("\n2. 创建项目:")
    project_data = {
        "name": "测试项目",
        "description": "这是一个测试项目",
        "location": "北京市朝阳区",
        "region": "华北",
        "client": "测试客户",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "status": "planning",
        "priority": "high",
        "budget": "100万"
    }
    response = requests.post(f"{BASE_URL}/projects/", json=project_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 201:
        created_project = response.json()
        print(f"响应: {created_project}")
        project_id = created_project["id"]
        
        # 3. 获取单个项目
        print(f"\n3. 获取项目 ID {project_id}:")
        response = requests.get(f"{BASE_URL}/projects/{project_id}")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 4. 更新项目
        print(f"\n4. 更新项目 ID {project_id}:")
        update_data = {
            "status": "active",
            "priority": "urgent"
        }
        response = requests.put(f"{BASE_URL}/projects/{project_id}", json=update_data)
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 5. 测试筛选功能
        print(f"\n5. 测试状态筛选:")
        response = requests.get(f"{BASE_URL}/projects/?status=active")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 6. 获取项目任务分配
        print(f"\n6. 获取项目任务分配:")
        response = requests.get(f"{BASE_URL}/projects/{project_id}/assignments")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
    else:
        try:
            print(f"测试出错: {response.json()}")
        except:
            print(f"测试出错: {response.text}")


def test_health_check():
    """测试健康检查"""
    print("=== 测试健康检查 ===")
    response = requests.get(f"{BASE_URL.replace('/api/v1', '')}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")


if __name__ == "__main__":
    try:
        test_health_check()
        test_project_crud()
    except requests.exceptions.ConnectionError:
        print("错误: 无法连接到API服务器，请确保服务器正在运行")
    except Exception as e:
        print(f"测试出错: {e}")