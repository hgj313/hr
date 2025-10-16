import api from './api';
import { Employee, Project, Assignment, PaginatedResponse, PaginationParams } from '../types';

export class DataService {
  // 员工相关API
  static async getEmployees(params?: PaginationParams): Promise<PaginatedResponse<Employee>> {
    const queryParams = params ? `?page=${params.page}&size=${params.size}` : '';
    return api.get(`/employees${queryParams}`);
  }

  static async getEmployee(id: number): Promise<Employee> {
    return api.get(`/employees/${id}`);
  }

  static async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    return api.post('/employees', employee);
  }

  static async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    return api.put(`/employees/${id}`, employee);
  }

  static async deleteEmployee(id: number): Promise<void> {
    return api.delete(`/employees/${id}`);
  }

  // 项目相关API
  static async getProjects(params?: PaginationParams): Promise<PaginatedResponse<Project>> {
    const queryParams = params ? `?page=${params.page}&size=${params.size}` : '';
    return api.get(`/projects${queryParams}`);
  }

  static async getProject(id: number): Promise<Project> {
    return api.get(`/projects/${id}`);
  }

  static async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    return api.post('/projects', project);
  }

  static async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    return api.put(`/projects/${id}`, project);
  }

  static async deleteProject(id: number): Promise<void> {
    return api.delete(`/projects/${id}`);
  }

  // 分配相关API
  static async getAssignments(params?: PaginationParams): Promise<PaginatedResponse<Assignment>> {
    const queryParams = params ? `?page=${params.page}&size=${params.size}` : '';
    return api.get(`/assignments${queryParams}`);
  }

  static async getAssignment(id: number): Promise<Assignment> {
    return api.get(`/assignments/${id}`);
  }

  static async createAssignment(assignment: Omit<Assignment, 'id'>): Promise<Assignment> {
    return api.post('/assignments', assignment);
  }

  static async updateAssignment(id: number, assignment: Partial<Assignment>): Promise<Assignment> {
    return api.put(`/assignments/${id}`, assignment);
  }

  static async deleteAssignment(id: number): Promise<void> {
    return api.delete(`/assignments/${id}`);
  }

  // 获取员工的分配
  static async getEmployeeAssignments(employeeId: number): Promise<Assignment[]> {
    return api.get(`/employees/${employeeId}/assignments`);
  }

  // 获取项目的分配
  static async getProjectAssignments(projectId: number): Promise<Assignment[]> {
    return api.get(`/projects/${projectId}/assignments`);
  }
}

export default DataService;