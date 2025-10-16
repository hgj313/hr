import React, { useState } from 'react';
import { Layout, Card, Typography } from 'antd';
import RegionSelector from '../components/RegionSelector';
import MainTimeSelector from '../components/MainTimeSelector';
import SubTimeSelector from '../components/SubTimeSelector';
import ResourcePool from '../components/ResourcePool';
import ProjectPool from '../components/ProjectPool';
import './StaffAllocation.css';

const { Header, Content } = Layout;
const { Title } = Typography;

interface TimeRange {
  start: Date;
  end: Date;
  granularity: 'week' | 'month' | 'year';
}

interface SubTimeRange {
  start: Date;
  end: Date;
}

const StaffAllocation: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('national');
  const [mainTimeRange, setMainTimeRange] = useState<TimeRange>({
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
    granularity: 'month'
  });
  const [subTimeRange, setSubTimeRange] = useState<SubTimeRange>({
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后
  });

  return (
    <Layout className="staff-allocation-layout">
      <Header className="staff-allocation-header">
        <div className="header-content">
          <Title level={2} className="page-title">人员调配管理</Title>
          <RegionSelector 
            value={selectedRegion} 
            onChange={setSelectedRegion}
          />
        </div>
      </Header>
      
      <Content className="staff-allocation-content">
        {/* 时间选择器区域 */}
        <Card 
          className="time-selector-card" 
          styles={{
            body: { padding: '16px 24px' }
          }}
        >
          <div className="time-selectors">
            <div className="main-time-selector">
              <MainTimeSelector 
                value={mainTimeRange}
                onChange={setMainTimeRange}
              />
            </div>
            <div className="sub-time-selector">
              <SubTimeSelector 
                value={subTimeRange}
                onChange={setSubTimeRange}
                mainTimeRange={mainTimeRange}
              />
            </div>
          </div>
        </Card>

        {/* 主要工作区域 */}
        <div className="main-workspace">
          {/* 左侧人力资源池 */}
          <div className="resource-pool-container">
            <ResourcePool 
              region={selectedRegion}
              timeRange={subTimeRange}
            />
          </div>

          {/* 右侧项目池 */}
          <div className="project-pool-container">
            <ProjectPool 
              region={selectedRegion}
              timeRange={mainTimeRange}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default StaffAllocation;