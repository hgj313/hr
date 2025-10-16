import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegionSelection.css';

interface Region {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  employeeCount: number;
}

const RegionSelection: React.FC = () => {
  const navigate = useNavigate();

  // 模拟区域数据
  const regions: Region[] = [
    {
      id: 'nationwide',
      name: '全国',
      description: '全国范围项目统筹管理',
      projectCount: 156,
      employeeCount: 1248
    },
    {
      id: 'central-china',
      name: '华中',
      description: '湖北、湖南、河南地区',
      projectCount: 45,
      employeeCount: 312
    },
    {
      id: 'south-china',
      name: '华南',
      description: '广东、广西、海南地区',
      projectCount: 38,
      employeeCount: 287
    },
    {
      id: 'east-china',
      name: '华东',
      description: '上海、江苏、浙江、安徽地区',
      projectCount: 52,
      employeeCount: 398
    },
    {
      id: 'north-china',
      name: '华北',
      description: '北京、天津、河北、山西地区',
      projectCount: 21,
      employeeCount: 251
    }
  ];

  const handleRegionClick = (regionId: string) => {
    navigate(`/region/${regionId}`);
  };

  return (
    <div className="region-selection">
      <div className="region-header">
        <h1>园林景观人力资源调度系统</h1>
        <p>请选择要管理的区域</p>
      </div>
      
      <div className="region-grid">
        {regions.map((region) => (
          <div 
            key={region.id}
            className="region-card"
            onClick={() => handleRegionClick(region.id)}
          >
            <div className="region-card-header">
              <h2>{region.name}</h2>
              <div className="region-stats">
                <span className="stat-item">
                  <span className="stat-number">{region.projectCount}</span>
                  <span className="stat-label">项目</span>
                </span>
                <span className="stat-item">
                  <span className="stat-number">{region.employeeCount}</span>
                  <span className="stat-label">员工</span>
                </span>
              </div>
            </div>
            
            <div className="region-card-body">
              <p>{region.description}</p>
            </div>
            
            <div className="region-card-footer">
              <button className="enter-region-btn">
                进入管理 →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionSelection;