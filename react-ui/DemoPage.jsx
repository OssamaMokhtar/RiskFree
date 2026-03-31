import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useRTL } from './hooks/useRTL';
import { useToast } from './hooks/useToast';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Table } from './components/Table';
import { Modal } from './components/Modal';
import { Input } from './components/Input';
import { Badge } from './components/Badge';
import { Chip } from './components/Chip';
import { ScoreMeter } from './components/ScoreMeter';
import { Skeleton } from './components/Skeleton';
import { Tabs } from './components/Tabs';

export const DemoPage = () => {
  const { toggleTheme } = useTheme('dark');
  const { toggleLang } = useRTL('en');
  const { showToast } = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [salary, setSalary] = useState(15000);
  const [pmt, setPmt] = useState(5000);

  const tableColumns = [
    { key: 'id', label: 'Application ID' },
    { key: 'name', label: 'Customer Name' },
    { key: 'product', label: 'Product' },
    { key: 'status', label: 'Status', render: (row) => <Badge label={row.status} variant={row.statusVariant} /> }
  ];

  const tableData = [
    { id: 'AE-2026-1234', name: 'Ahmed Al-Mansouri', product: 'Personal Loan', status: 'Pending', statusVariant: 'warning' },
    { id: 'AE-2026-1235', name: 'Fatima Al-Khalifa', product: 'Credit Card', status: 'Approved', statusVariant: 'success' },
  ];

  const dsr = ((pmt / salary) * 100).toFixed(1);

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>GCC AI Credit Platform UX/UI Kit</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Production-ready React Component Library.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="secondary" onClick={toggleLang}>Toggle RTL/LTR (عربي/EN)</Button>
          <Button variant="secondary" onClick={toggleTheme}>Toggle Dark/Light Mode</Button>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>1. Buttons & Controls</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <Button variant="primary">Approve Application</Button>
        <Button variant="secondary">Save as Draft</Button>
        <Button variant="ghost">View History</Button>
        <Button variant="danger">Decline</Button>
        <Button disabled>Disabled State</Button>
      </div>

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>2. Badges & Chips</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Badge label="Approved (Low Risk)" variant="success" />
        <Badge label="Review (Medium Risk)" variant="warning" />
        <Badge label="Critical (High Risk)" variant="danger" />
        <Badge label="Information" variant="info" />
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <Chip label="Sector: Trading" />
        <Chip label="Years in Business: 7" />
        <Chip label="Country: UAE" />
      </div>

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>3. Tabs Navigation</h2>
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        tabs={[{ id: 'tab-1', label: 'Overview' }, { id: 'tab-2', label: 'Financial Health' }, { id: 'tab-3', label: 'Sector Risk' }]} 
      />

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>4. Cards & Score Meter</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card title="Approval Rate" icon="📦" trend={{ value: '↑ 3.2%', type: 'up' }}>68.4%</Card>
        
        <Card title="Credit Score" style={{ textAlign: 'center' }}>
          <ScoreMeter score={742} maxScore={850} grade="B+" label="" />
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Skeleton type="avatar" />
            <div style={{ flex: 1 }}>
              <Skeleton type="title" />
              <Skeleton type="text" width="40%" />
            </div>
          </div>
          <Skeleton type="text" />
          <Skeleton type="text" />
          <Skeleton type="text" width="80%" />
        </Card>
      </div>

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>5. Data Tables</h2>
      <div style={{ marginBottom: '32px' }}>
        <Table columns={tableColumns} data={tableData} />
      </div>

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>6. Forms & Scenario Simulator (What-if)</h2>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <Input 
              label="Declared Monthly Salary (AED)" 
              type="number" 
              value={salary} 
              onChange={e => setSalary(Number(e.target.value))} 
            />
            <Input 
              label={`Requested EMI (AED) - ${pmt.toLocaleString()}`} 
              type="range" 
              min="1000" max="15000" step="500" 
              value={pmt} 
              onChange={e => setPmt(Number(e.target.value))} 
              className="slider"
            />
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Simulation Results</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Adjust the sliders to see the real-time impact on the Debt Service Ratio (DSR).</p>
            <Badge label={`DSR: ${dsr}%`} variant={dsr > 50 ? 'danger' : dsr > 40 ? 'warning' : 'success'} style={{ fontSize: '16px', padding: '6px 12px' }}/>
          </div>
        </div>
      </Card>

      <h2 className="section-title" style={{ marginTop: '32px', marginBottom: '24px', color: 'var(--primary-500)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>7. Overlays & Modals</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
        <Button onClick={() => setModalOpen(true)}>Open Confirmation Modal</Button>
        <Button variant="secondary" onClick={() => showToast('Application status updated to Pending Review.', 'success')}>Trigger Toast Notification</Button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)}
        title="Confirm Decision"
        actions={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { showToast('Action confirmed successfully!', 'success'); setModalOpen(false); }}>Yes, Approve</Button>
          </div>
        }
      >
        Are you sure you want to approve this application overriding the AI Copilot recommendation? This action will be logged in the audit trail.
      </Modal>
    </div>
  );
};
