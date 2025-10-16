// 员工相关类型
export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
}

// 项目相关类型
export interface Project {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  start_date?: string;
  end_date?: string;
}

// 分配相关类型
export interface Assignment {
  id: number;
  employee_id: number;
  project_id: number;
  start_time: string;
  end_time: string;
  description?: string;
}

// 冲突检测相关类型
export interface ConflictCheckRequest {
  employee_id: number;
  start_time: string;
  end_time: string;
}

export interface ConflictDetail {
  assignment_id: number;
  project_id: number;
  project_name: string;
  conflict_start: string;
  conflict_end: string;
  overlap_hours: number;
  overlap_percentage: number;
}

export interface ConflictCheckResponse {
  has_conflict: boolean;
  conflict_count: number;
  conflicts: ConflictDetail[];
  total_overlap_hours: number;
}

// 多员工冲突检测
export interface EmployeeAssignment {
  employee_id: number;
  start_time: string;
  end_time: string;
}

export interface MultipleConflictCheckRequest {
  employee_assignments: EmployeeAssignment[];
}

export interface MultipleConflictCheckResponse {
  total_employees: number;
  total_conflicts: number;
  conflict_rate: number;
  details: Record<number, ConflictCheckResponse>;
}

// 可用性检查
export interface AvailabilityCheckRequest {
  employee_id: number;
  start_date: string;
  end_date: string;
}

export interface AvailableTimeSlot {
  start_time: string;
  end_time: string;
  duration_hours: number;
}

export interface AvailabilityCheckResponse {
  employee_id: number;
  available_slots: AvailableTimeSlot[];
  total_available_hours: number;
}

// 最优时间段查找
export interface OptimalTimeRequest {
  employee_ids: number[];
  duration_hours: number;
  start_date: string;
  end_date: string;
}

export interface OptimalTimeResponse {
  found: boolean;
  optimal_slot?: AvailableTimeSlot;
  message: string;
}

// 时间轴相关类型
export interface TimeRange {
  start: string;
  end: string;
  unit: string;
}

export interface TimelineItem {
  assignment_id: number;
  project_id: number;
  project_name: string;
  start_time: string;
  end_time: string;
  grid_start: number;
  grid_end: number;
  row: number;
}

export interface TimelineStats {
  total_hours: number;
  assigned_hours: number;
  utilization_rate: number;
  assignment_count: number;
  max_concurrent_assignments: number;
}

export interface EmployeeTimelineResponse {
  employee: Employee;
  time_range: TimeRange;
  time_grid: string[];
  timeline_items: TimelineItem[];
  stats: TimelineStats;
}

export interface ProjectTimelineResponse {
  project: Project;
  time_range: TimeRange;
  time_grid: string[];
  employee_timelines: Record<string, any>;
  stats: TimelineStats;
}

export interface DepartmentTimelineResponse {
  department: string;
  time_range: TimeRange;
  time_grid: string[];
  employee_timelines: Record<string, any>;
  stats: TimelineStats;
}

// API响应基础类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// 分页相关类型
export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}