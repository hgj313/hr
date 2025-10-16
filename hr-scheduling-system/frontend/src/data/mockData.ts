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
  },
  {
    id: 'emp009',
    name: '郑十一',
    role: '安全员',
    department: '安全部',
    skills: ['安全监督', '风险评估', '应急处理'],
    avatar: '🦺',
    timeline: [],
    isAvailable: true,
    region: 'north',
    email: 'zhengshiyi@company.com',
    phone: '138-0000-0009',
    hireDate: '2022-09-15'
  },
  {
    id: 'emp010',
    name: '冯十二',
    role: '质检员',
    department: '质量部',
    skills: ['质量检测', '标准制定', '问题分析'],
    avatar: '🔍',
    timeline: [
      {
        id: 'timeline004',
        projectId: 'proj004',
        projectName: '住宅小区景观',
        startDate: '2024-02-10',
        endDate: '2024-03-10',
        assignmentType: 'dispatched',
        duration: 29
      }
    ],
    isAvailable: false,
    region: 'north',
    email: 'fengshier@company.com',
    phone: '138-0000-0010',
    hireDate: '2021-11-20'
  },
  {
    id: 'emp011',
    name: '陈十三',
    role: '材料员',
    department: '采购部',
    skills: ['材料采购', '库存管理', '供应商管理'],
    avatar: '📦',
    timeline: [],
    isAvailable: true,
    region: 'west',
    email: 'chenshisan@company.com',
    phone: '138-0000-0011',
    hireDate: '2020-07-08'
  },
  {
    id: 'emp012',
    name: '褚十四',
    role: '测量员',
    department: '技术部',
    skills: ['地形测量', 'GPS定位', '数据分析'],
    avatar: '📐',
    timeline: [],
    isAvailable: true,
    region: 'west',
    email: 'chushisi@company.com',
    phone: '138-0000-0012',
    hireDate: '2023-01-12'
  },
  {
    id: 'emp013',
    name: '卫十五',
    role: '环保专员',
    department: '环保部',
    skills: ['环境监测', '污染治理', '环保法规'],
    avatar: '🌍',
    timeline: [
      {
        id: 'timeline005',
        projectId: 'proj005',
        projectName: '工业园区绿化',
        startDate: '2024-01-25',
        endDate: '2024-02-25',
        assignmentType: 'dispatched',
        duration: 31
      }
    ],
    isAvailable: false,
    region: 'southwest',
    email: 'weishiwu@company.com',
    phone: '138-0000-0013',
    hireDate: '2022-03-18'
  },
  {
    id: 'emp014',
    name: '蒋十六',
    role: '财务专员',
    department: '财务部',
    skills: ['成本核算', '预算管理', '财务分析'],
    avatar: '💰',
    timeline: [],
    isAvailable: true,
    region: 'central',
    email: 'jiangshiliu@company.com',
    phone: '138-0000-0014',
    hireDate: '2019-05-22'
  },
  {
    id: 'emp015',
    name: '沈十七',
    role: '人事专员',
    department: '人事部',
    skills: ['招聘管理', '培训组织', '绩效考核'],
    avatar: '👥',
    timeline: [],
    isAvailable: true,
    region: 'east',
    email: 'shenshiqi@company.com',
    phone: '138-0000-0015',
    hireDate: '2021-08-30'
  },
  {
    id: 'emp016',
    name: '韩十八',
    role: '技术员',
    department: '技术部',
    skills: ['技术支持', '设备调试', '故障排除'],
    avatar: '🔧',
    timeline: [],
    isAvailable: true,
    region: 'south',
    email: 'hanshiba@company.com',
    phone: '138-0000-0016',
    hireDate: '2023-04-15'
  },
  {
    id: 'emp017',
    name: '杨十九',
    role: '驾驶员',
    department: '后勤部',
    skills: ['货车驾驶', '路线规划', '车辆维护'],
    avatar: '🚛',
    timeline: [
      {
        id: 'timeline006',
        projectId: 'proj001',
        projectName: '中央公园改造',
        startDate: '2024-02-05',
        endDate: '2024-03-05',
        assignmentType: 'dispatched',
        duration: 29
      }
    ],
    isAvailable: false,
    region: 'north',
    email: 'yangshijiu@company.com',
    phone: '138-0000-0017',
    hireDate: '2020-12-10'
  },
  {
    id: 'emp018',
    name: '朱二十',
    role: '保洁员',
    department: '后勤部',
    skills: ['环境清洁', '垃圾分类', '卫生维护'],
    avatar: '🧹',
    timeline: [],
    isAvailable: true,
    region: 'west',
    email: 'zhuershí@company.com',
    phone: '138-0000-0018',
    hireDate: '2022-06-25'
  },
  {
    id: 'emp019',
    name: '秦二一',
    role: '电工',
    department: '工程部',
    skills: ['电路安装', '电气维修', '照明设计'],
    avatar: '⚡',
    timeline: [],
    isAvailable: true,
    region: 'central',
    email: 'qinershiyi@company.com',
    phone: '138-0000-0019',
    hireDate: '2021-02-14'
  },
  {
    id: 'emp020',
    name: '尤二二',
    role: '水工',
    department: '工程部',
    skills: ['管道安装', '水系统维护', '喷灌设计'],
    avatar: '💧',
    timeline: [
      {
        id: 'timeline007',
        projectId: 'proj002',
        projectName: '滨江绿化带',
        startDate: '2024-01-30',
        endDate: '2024-02-28',
        assignmentType: 'dispatched',
        duration: 29
      }
    ],
    isAvailable: false,
    region: 'south',
    email: 'youerer@company.com',
    phone: '138-0000-0020',
    hireDate: '2020-10-05'
  },
  {
    id: 'emp021',
    name: '许二三',
    role: '园林工程师',
    department: '设计部',
    skills: ['园林规划', '植物配置', '景观效果图'],
    avatar: '🌳',
    timeline: [],
    isAvailable: true,
    region: 'east',
    email: 'xuershisan@company.com',
    phone: '138-0000-0021',
    hireDate: '2019-09-12'
  },
  {
    id: 'emp022',
    name: '何二四',
    role: '苗木技师',
    department: '园艺部',
    skills: ['苗木培育', '嫁接技术', '病虫害防治'],
    avatar: '🌱',
    timeline: [],
    isAvailable: true,
    region: 'southwest',
    email: 'heershisi@company.com',
    phone: '138-0000-0022',
    hireDate: '2022-12-08'
  },
  {
    id: 'emp023',
    name: '吕二五',
    role: '土壤专家',
    department: '技术部',
    skills: ['土壤检测', '土壤改良', '肥料配制'],
    avatar: '🌾',
    timeline: [
      {
        id: 'timeline008',
        projectId: 'proj003',
        projectName: '商业广场绿化',
        startDate: '2024-02-15',
        endDate: '2024-03-15',
        assignmentType: 'dispatched',
        duration: 29
      }
    ],
    isAvailable: false,
    region: 'west',
    email: 'lvershiwu@company.com',
    phone: '138-0000-0023',
    hireDate: '2021-07-20'
  },
  {
    id: 'emp024',
    name: '施二六',
    role: '石材工',
    department: '施工部',
    skills: ['石材切割', '石材铺装', '雕刻技艺'],
    avatar: '🪨',
    timeline: [],
    isAvailable: true,
    region: 'north',
    email: 'shiershiliu@company.com',
    phone: '138-0000-0024',
    hireDate: '2020-04-18'
  },
  {
    id: 'emp025',
    name: '张二七',
    role: '木工',
    department: '施工部',
    skills: ['木结构制作', '防腐处理', '园林小品'],
    avatar: '🪵',
    timeline: [],
    isAvailable: true,
    region: 'central',
    email: 'zhangershiqi@company.com',
    phone: '138-0000-0025',
    hireDate: '2023-03-10'
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