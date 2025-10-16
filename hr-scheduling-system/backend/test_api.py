"""
API测试脚本
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_employee_crud():
    """测试员工CRUD操作"""
    print("=== 测试员工API ===")
    
    # 1. 获取员工列表
    print("\n1. 获取员工列表:")
    response = requests.get(f"{BASE_URL}/employees/")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 2. 创建员工
    print("\n2. 创建员工:")
    employee_data = {
        "name": "测试员工",
        "phone": "13800138000",
        "email": "test@example.com",
        "department": "技术部",
        "position": "开发工程师",
        "skills": '["Python", "FastAPI"]',  # JSON字符串
        "status": "active"
    }
    response = requests.post(f"{BASE_URL}/employees/", json=employee_data)
    print(f"状态码: {response.status_code}")
    if response.status_code == 201:
        created_employee = response.json()
        print(f"响应: {created_employee}")
        employee_id = created_employee["id"]
        
        # 3. 获取单个员工
        print(f"\n3. 获取员工 ID {employee_id}:")
        response = requests.get(f"{BASE_URL}/employees/{employee_id}")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        
        # 4. 更新员工
        print(f"\n4. 更新员工 ID {employee_id}:")
        update_data = {
            "name": "更新后的员工",
            "position": "高级开发工程师"
        }
        response = requests.put(f"{BASE_URL}/employees/{employee_id}", json=update_data)
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
    response = requests.get("http://localhost:8000/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")

if __name__ == "__main__":
    try:
        test_health_check()
        test_employee_crud()
    except requests.exceptions.ConnectionError:
        print("错误: 无法连接到API服务器，请确保服务器正在运行")
    except Exception as e:
        print(f"测试出错: {e}")