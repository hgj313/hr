import React from 'react';
import './TimePrecisionController.css';

interface TimePrecisionControllerProps {
  value: string;
  onChange: (precision: string) => void;
  options: string[];
}

const TimePrecisionController: React.FC<TimePrecisionControllerProps> = ({
  value,
  onChange,
  options
}) => {
  const precisionLabels: Record<string, string> = {
    'hour': '小时',
    'day': '天',
    'week': '周',
    'month': '月',
    'quarter': '季度',
    'year': '年'
  };

  return (
    <div className="time-precision-controller">
      <label className="precision-label">时间精度:</label>
      <div className="precision-options">
        {options.map((option) => (
          <button
            key={option}
            className={`precision-btn ${value === option ? 'active' : ''}`}
            onClick={() => onChange(option)}
          >
            {precisionLabels[option] || option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimePrecisionController;