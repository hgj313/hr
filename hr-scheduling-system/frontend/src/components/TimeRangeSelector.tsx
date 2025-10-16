import React from 'react';
import './TimeRangeSelector.css';

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      start: e.target.value
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      end: e.target.value
    });
  };

  const handleQuickSelect = (months: number) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + months, 0);
    
    onChange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  return (
    <div className="time-range-selector">
      <div className="date-inputs">
        <div className="date-input-group">
          <label>开始日期</label>
          <input
            type="date"
            value={value.start}
            onChange={handleStartDateChange}
            className="date-input"
          />
        </div>
        <div className="date-separator">~</div>
        <div className="date-input-group">
          <label>结束日期</label>
          <input
            type="date"
            value={value.end}
            onChange={handleEndDateChange}
            className="date-input"
          />
        </div>
      </div>
      
      <div className="quick-select">
        <span className="quick-label">快选:</span>
        <button 
          className="quick-btn"
          onClick={() => handleQuickSelect(1)}
        >
          本月
        </button>
        <button 
          className="quick-btn"
          onClick={() => handleQuickSelect(3)}
        >
          3个月
        </button>
        <button 
          className="quick-btn"
          onClick={() => handleQuickSelect(6)}
        >
          半年
        </button>
        <button 
          className="quick-btn"
          onClick={() => handleQuickSelect(12)}
        >
          全年
        </button>
      </div>
    </div>
  );
};

export default TimeRangeSelector;