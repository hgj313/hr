"""
API v1 主路由
"""
from fastapi import APIRouter

from api.v1.endpoints import employees, projects, assignments, algorithms

api_router = APIRouter()

# 包含各个模块的路由
api_router.include_router(
    employees.router, 
    prefix="/employees", 
    tags=["employees"]
)

api_router.include_router(
    projects.router, 
    prefix="/projects", 
    tags=["projects"]
)

api_router.include_router(
    assignments.router, 
    prefix="/assignments", 
    tags=["assignments"]
)

api_router.include_router(
    algorithms.router, 
    prefix="/algorithms", 
    tags=["algorithms"]
)