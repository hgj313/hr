import api from './api';
import {
  ConflictCheckRequest,
  ConflictCheckResponse,
  MultipleConflictCheckRequest,
  MultipleConflictCheckResponse,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
  OptimalTimeRequest,
  OptimalTimeResponse,
  EmployeeTimelineResponse,
  ProjectTimelineResponse,
  DepartmentTimelineResponse,
} from '../types';

export class AlgorithmService {
  // 健康检查
  static async healthCheck(): Promise<{ status: string }> {
    return api.get('/algorithms/health');
  }

  // 单员工冲突检测
  static async checkConflict(request: ConflictCheckRequest): Promise<ConflictCheckResponse> {
    return api.post('/algorithms/conflicts/check', request);
  }

  // 多员工冲突检测
  static async checkMultipleConflicts(
    request: MultipleConflictCheckRequest
  ): Promise<MultipleConflictCheckResponse> {
    return api.post('/algorithms/conflicts/check-multiple', request);
  }

  // 员工可用性检查
  static async checkAvailability(
    request: AvailabilityCheckRequest
  ): Promise<AvailabilityCheckResponse> {
    return api.post('/algorithms/availability/check', request);
  }

  // 最优时间段查找
  static async findOptimalTime(request: OptimalTimeRequest): Promise<OptimalTimeResponse> {
    return api.post('/algorithms/optimal-time/find', request);
  }

  // 获取员工时间轴
  static async getEmployeeTimeline(
    employeeId: number,
    startDate?: string,
    endDate?: string
  ): Promise<EmployeeTimelineResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const url = `/algorithms/timeline/employee/${employeeId}${params.toString() ? '?' + params.toString() : ''}`;
    return api.get(url);
  }

  // 获取项目时间轴
  static async getProjectTimeline(
    projectId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ProjectTimelineResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const url = `/algorithms/timeline/project/${projectId}${params.toString() ? '?' + params.toString() : ''}`;
    return api.get(url);
  }

  // 获取部门时间轴
  static async getDepartmentTimeline(
    department: string,
    startDate?: string,
    endDate?: string
  ): Promise<DepartmentTimelineResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const url = `/algorithms/timeline/department/${encodeURIComponent(department)}${params.toString() ? '?' + params.toString() : ''}`;
    return api.get(url);
  }
}

export default AlgorithmService;