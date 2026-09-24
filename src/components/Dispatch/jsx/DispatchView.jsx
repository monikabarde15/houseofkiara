import { useState } from 'react';
// import DispatchHeader from './DispatchHeader';
import { TodayTab, TomorrowTab, ThisWeekTab } from '../tabs';
import './../css/DispatchView.css';

const TABS = [
  { key: 'today', label: 'Today', count: 1 },
  { key: 'tomorrow', label: 'Tomorrow', count: 2 },
  { key: 'week', label: 'This Week', count: 6 },
];

export default function DispatchView(props) {
  const [activeTab, setActiveTab] = useState('today');
  const [demoDate, setDemoDate] = useState('2026-03-23');

  const renderTab = () => {
    if (activeTab === 'today') return <TodayTab demoDate={demoDate} />;
    if (activeTab === 'tomorrow') return <TomorrowTab demoDate={demoDate} />;
    return <ThisWeekTab demoDate={demoDate} />;
  };

  return (
    <div className="dispatch-page">
      {/* <DispatchHeader /> */}

      <div className="dispatch-body">
        <span className="dispatch-eyebrow">OPERATIONS</span>
        <h1 className="dispatch-title">Dispatch Schedule</h1>
        <p className="dispatch-subtitle">
          Everything leaving the studio today, tomorrow, and this week. Mark dispatched, print labels, and jump
          to any order.
        </p>

        <div className="dispatch-date-row">
          <label>Demo date:</label>
          <input
            type="date"
            value={demoDate}
            onChange={(e) => setDemoDate(e.target.value)}
          />
          <span className="dispatch-date-note">— shared with the Operations Calendar's demo date</span>
        </div>

        <div className="dispatch-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`dispatch-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="dispatch-tab-content">{renderTab()}</div>
      </div>
    </div>
  );
}