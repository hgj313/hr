// 静态Mock数据 - 纯UI演示用

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  avatar?: string;
  timeline: EmployeeTimelineEntry[];
  isAvailable: boolean;
  region: string;
  email?: string;
  phone?: string;
  hireDate: string;
}

export interface EmployeeTimelineEntry {
  id: string;
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  assignmentType: 'dispatched' | 'reserved' | 'vacation';
  duration: number;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  employeeCount: number;
  progress: number;
  assignedEmployees: AssignedEmployee[];
  requiredSkills: string[];
  location: string;
  budget: number;
  region: string;
}

export interface AssignedEmployee {
  employeeId: string;
  employeeName: string;
  assignedDate: string;
  duration: number;
  role: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  projects: Project[];
  employees: Employee[];
}

export interface TimeRange {
  start: string;
  end: string;
  color?: string;
  label?: string;
}

// Mock员工数据
export const mockEmployees: Employee[] = [
  {
    id: 'emp001',
    name: '张三',
    role: '高级园艺师',
    department: '园艺部',
    skills: ['植物养护', '景观设计', '土壤改良'],
    avatar: '👨‍🌾',
    timeline: [
      {
        id: 'timeline001',
        projectId: 'proj001',
        projectName: '中央公园改造',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        assignmentType: 'dispatched',
        duration: 31
      }
    ],
    isAvailable: false,
    region: 'east',
    email: 'zhangsan@company.com',
    phone: '138-0000-0001',
    hireDate: '2020-03-15'
  },
  {
    id: 'emp002',
    name: '李四',
    role: '景观设计师',
    department: '设计部',
    skills: ['CAD设计', '3D建模', '方案规划'],
    avatar: '👩‍💼',
    timeline: [],
    isAvailable: true,
    region: 'east',
    email: 'lisi@company.com',
    phone: '138-0000-0002',
    hireDate: '2021-06-20'
  },
  {
    id: 'emp003',
    name: '王五',
    role: '施工队长',
    department: '施工部',
    skills: ['项目管理', '团队协调', '质量控制'],
    avatar: '👷‍♂️',
    timeline: [
      {
        id: 'timeline002',
        projectId: 'proj002',
        projectName: '滨江绿化带',
        startDate: '2024-02-01',
        endDate: '2024-03-01',
        assignmentType: 'dispatched',
        duration: 29
      }
    ],
    isAvailable: false,
    region: 'south',
    email: 'wangwu@company.com',
    phone: '138-0000-0003',
    hireDate: '2019-08-10'
  },
  {
    id: 'emp004',
    name: '赵六',
    role: '植物专家',
    department: '园艺部',
    skills: ['植物识别', '病虫害防治', '育苗技术'],
    avatar: '🌱',
    timeline: [],
    isAvailable: true,
    region: 'south',
    email: 'zhaoliu@company.com',
    phone: '138-0000-0004',
    hireDate: '2022-01-15'
  },
  {
    id: 'emp005',
    name: '钱七',
    role: '水电工程师',
    department: '工程部',
    skills: ['给排水', '电气安装', '设备维护'],
    avatar: '⚡',
    timeline: [],
    isAvailable: true,
    region: 'central',
    email: 'qianqi@company.com',
    phone: '138-0000-0005',
    hireDate: '2020-11-20'
  },
  {
    id: 'emp006',
    name: '孙八',
    role: '绿化工',
    department: '园艺部',
    skills: ['草坪养护', '树木修剪', '花卉种植'],
    avatar: '🌿',
    timeline: [
      {
        id: 'timeline003',
        projectId: 'proj003',
        projectName: '商业广场绿化',
        startDate: '2024-01-20',
        endDate: '2024-02-20',
        assignmentType: 'dispatched',
        duration: 31
      }
    ],
    isAvailable: false,
    region: 'southwest',
    email: 'sunba@company.com',
    phone: '138-0000-0006',
    hireDate: '2021-04-05'
  },
  {
    id: 'emp007',
    name: '周九',
    role: '项目经理',
    department: '管理部',
    skills: ['项目管理', '成本控制', '客户沟通'],
    avatar: '📋',
    timeline: [],
    isAvailable: true,
    region: 'central',
    email: 'zhoujiu@company.com',
    phone: '138-0000-0007',
    hireDate: '2018-12-01'
  },
  {
    id: 'emp008',
    name: '吴十',
    role: '机械操作员',
    department: '设备部',
    skills: ['挖掘机操作', '装载机操作', '设备维修'],
    avatar: '🚜',
    timeline: [],
    isAvailable: true,
    region: 'east',
    email: 'wushi@company.com',
    phone: '138-0000-0008',
    hireDate: '2023-02-28'
  }
];

// Mock项目数据
export const mockProjects: Project[] = [
  {
    id: 'proj001',
    name: '中央公园改造项目',
    type: '公园改造',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    status: 'ongoing',
    priority: 'high',
    employeeCount: 3,
    progress: 35,
    assignedEmployees: [
      {
        employeeId: 'emp001',
        employeeName: '张三',
        assignedDate: '2024-01-15',
        duration: 31,
        role: '高级园艺师'
      }
    ],
    requiredSkills: ['植物养护', '景观设计'],
    location: '市中心',
    budget: 500000,
    region: 'east'
  },
  {
    id: 'proj002',
    name: '滨江绿化带建设',
    type: '绿化工程',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    status: 'ongoing',
    priority: 'medium',
    employeeCount: 5,
    progress: 20,
    assignedEmployees: [
      {
        employeeId: 'emp003',
        employeeName: '王五',
        assignedDate: '2024-02-01',
        duration: 29,
        role: '施工队长'
      }
    ],
    requiredSkills: ['项目管理', '团队协调'],
    location: '滨江区',
    budget: 800000,
    region: 'south'
  },
  {
    id: 'proj003',
    name: '商业广场绿化',
    type: '商业景观',
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    status: 'ongoing',
    priority: 'high',
    employeeCount: 4,
    progress: 50,
    assignedEmployees: [
      {
        employeeId: 'emp006',
        employeeName: '孙八',
        assignedDate: '2024-01-20',
        duration: 31,
        role: '绿化工'
      }
    ],
    requiredSkills: ['草坪养护', '花卉种植'],
    location: '商业区',
    budget: 300000,
    region: 'southwest'
  },
  {
    id: 'proj004',
    name: '住宅小区景观',
    type: '住宅景观',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    status: 'planning',
    priority: 'medium',
    employeeCount: 0,
    progress: 0,
    assignedEmployees: [],
    requiredSkills: ['景观设计', 'CAD设计'],
    location: '新城区',
    budget: 400000,
    region: 'central'
  },
  {
    id: 'proj005',
    name: '工业园区绿化',
    type: '工业景观',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    status: 'planning',
    priority: 'low',
    employeeCount: 0,
    progress: 0,
    assignedEmployees: [],
    requiredSkills: ['环境治理', '工业绿化'],
    location: '开发区',
    budget: 600000,
    region: 'east'
  }
];

// Mock区域数据
export const mockRegions: Region[] = [
  {
    id: 'nationwide',
    name: '全国分布',
    code: 'nationwide',
    projects: mockProjects,
    employees: mockEmployees
  },
  {
    id: 'east-china',
    name: '华东区域',
    code: 'east-china',
    projects: mockProjects.filter(p => p.region === 'east'),
    employees: mockEmployees.filter(e => e.region === 'east')
  },
  {
    id: 'south-china',
    name: '华南区域',
    code: 'south-china',
    projects: mockProjects.filter(p => p.region === 'south'),
    employees: mockEmployees.filter(e => e.region === 'south')
  },
  {
    id: 'central-china',
    name: '华中区域',
    code: 'central-china',
    projects: mockProjects.filter(p => p.region === 'central'),
    employees: mockEmployees.filter(e => e.region === 'central')
  },
  {
    id: 'north-china',
    name: '华北区域',
    code: 'north-china',
    projects: mockProjects.filter(p => p.region === 'north'),
    employees: mockEmployees.filter(e => e.region === 'north')
  }
];

// Mock时间选择器状态
export const mockTimeSelectionState = {
  primaryTimeRange: {
    start: '2024-01-01',
    end: '2024-06-30',
    label: '主时间范围'
  },
  secondaryTimeRanges: [
    {
      start: '2024-02-01',
      end: '2024-02-15',
      color: '#ff6b6b',
      label: '春节假期'
    },
    {
      start: '2024-03-15',
      end: '2024-03-30',
      color: '#4ecdc4',
      label: '设备维护期'
    }
  ],
  precision: 'month' as const
};

// 场景切换数据
export const scenarios = {
  normal: {
    name: '正常工作场景',
    availableEmployees: mockEmployees.filter(e => e.isAvailable),
    busyEmployees: mockEmployees.filter(e => !e.isAvailable),
    projects: mockProjects
  },
  busy: {
    name: '高峰期场景',
    availableEmployees: mockEmployees.filter(e => e.isAvailable).slice(0, 2),
    busyEmployees: mockEmployees.filter(e => !e.isAvailable).concat(
      mockEmployees.filter(e => e.isAvailable).slice(2)
    ),
    projects: mockProjects.concat([
      {
        id: 'proj006',
        name: '紧急绿化项目',
        type: '应急工程',
        startDate: '2024-02-20',
        endDate: '2024-03-20',
        status: 'planning',
        priority: 'high',
        employeeCount: 0,
        progress: 0,
        assignedEmployees: [],
        requiredSkills: ['快速施工', '应急处理'],
        location: '市区',
        budget: 200000,
        region: 'east'
      }
    ])
  }
};