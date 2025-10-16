"""
pytest配置文件
"""
import pytest
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.database import Base
from models import User, Employee, Project, Assignment


# 测试数据库配置
TEST_DATABASE_URL = "sqlite:///./test.db"


@pytest.fixture(scope="session")
def engine():
    """创建测试数据库引擎"""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(engine):
    """创建数据库会话"""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    yield session
    session.rollback()
    session.close()


@pytest.fixture
def sample_user(db_session):
    """创建示例用户"""
    # 使用唯一标识符避免数据冲突
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user = User(
        username=f"testuser_{unique_id}",
        email=f"test_{unique_id}@example.com",
        password_hash="hashed_password",
        role="admin"
    )
    db_session.add(user)
    db_session.flush()  # 获取ID但不提交事务
    return user


@pytest.fixture
def sample_employee(db_session, sample_user):
    """创建示例员工"""
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    employee = Employee(
        name=f"张三_{unique_id}",
        phone=f"138{unique_id[:8]}",
        email=f"zhangsan_{unique_id}@example.com",
        skills='["挖掘机操作", "园林设计"]',
        position="高级技工",
        department="施工部",
        status="assigned",
        user_id=sample_user.id
    )
    db_session.add(employee)
    db_session.flush()
    return employee


@pytest.fixture
def sample_project(db_session):
    """创建示例项目"""
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    project = Project(
        name=f"中央公园景观改造_{unique_id}",
        description="对中央公园进行全面的景观改造",
        location="北京市朝阳区",
        region="华北",
        client="北京市园林局",
        start_date=datetime(2024, 1, 1),
        end_date=datetime(2024, 6, 30),
        status="active",
        priority="high",
        budget=1000000.0
    )
    db_session.add(project)
    db_session.flush()
    return project


@pytest.fixture
def sample_assignment(db_session, sample_employee, sample_project, sample_user):
    """创建示例分配"""
    assignment = Assignment(
        employee_id=sample_employee.id,
        project_id=sample_project.id,
        start_time=datetime(2024, 1, 15, 8, 0),
        end_time=datetime(2024, 1, 15, 17, 0),
        status="assigned",
        notes="负责挖掘工作",
        created_by=sample_user.id
    )
    db_session.add(assignment)
    db_session.flush()
    return assignment