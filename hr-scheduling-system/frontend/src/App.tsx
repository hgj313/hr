import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegionSelection from './pages/RegionSelection';
import RegionDashboard from './pages/RegionDashboard';
import ProjectDetail from './pages/ProjectDetail';
import StaffAllocation from './pages/StaffAllocation';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 区域选择页面 - 系统入口 */}
        <Route path="/" element={<RegionSelection />} />
        
        {/* 区域专属页面 - 显示该区域的项目时间轴 */}
        <Route path="/region/:regionId" element={<RegionDashboard />} />
        
        {/* 项目详情页面 - 显示项目信息和员工时间轴 */}
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        
        {/* 区域项目详情页面 - 从区域仪表板跳转的项目详情 */}
        <Route path="/region/:regionId/project/:projectId" element={<ProjectDetail />} />
        
        {/* 保留原有的人员调配页面作为备用 */}
        <Route path="/allocation" element={<StaffAllocation />} />
      </Routes>
    </div>
  );
}

export default App;