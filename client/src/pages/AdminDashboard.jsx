import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const STAT_META = [
  { key:'totalBooks',           label:'Total Books',          icon:'📚', color:'#dbeafe', iconColor:'#2563eb' },
  { key:'totalUsers',           label:'Total Users',          icon:'👥', color:'#dcfce7', iconColor:'#16a34a' },
  { key:'totalIssues',          label:'Total Issues',         icon:'📋', color:'#fef9c3', iconColor:'#b45309' },
  { key:'totalAvailableCopies', label:'Available Copies',     icon:'✅', color:'#f3e8ff', iconColor:'#7c3aed' },
  { key:'recentIssues',         label:'Issues (Last 30 Days)',icon:'📈', color:'#cffafe', iconColor:'#0891b2' },
];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/reports/analytics')
      .then(r => setAnalytics(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ov = analytics?.overview || {};

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-sub">Welcome back, {user?.name} — here's what's happening today.</p>
        </div>
        <Link to="/books/add" className="btn btn-primary">+ Add New Book</Link>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <div className="grid-4 mb-24">
          {STAT_META.map(({ key, label, icon, color, iconColor }) => (
            <div key={key} className="stat-card">
              <div className="stat-icon-wrap" style={{ backgroundColor: color }}>
                <span style={{ color: iconColor }}>{icon}</span>
              </div>
              <div className="stat-body">
                <div className="stat-value">{ov[key] ?? '—'}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text-primary)', marginBottom:'16px' }}>Quick Access</h2>
      <div className="grid-3">
        <Link to="/books" className="quick-card">
          <div className="quick-card-icon">📚</div>
          <h3>Manage Books</h3>
          <p>Add, edit, search, and delete books</p>
        </Link>
        <Link to="/admin/users" className="quick-card">
          <div className="quick-card-icon">👥</div>
          <h3>Manage Users</h3>
          <p>View, edit, and remove user accounts</p>
        </Link>
        <Link to="/admin/reports" className="quick-card">
          <div className="quick-card-icon">📊</div>
          <h3>Reports &amp; Analytics</h3>
          <p>System stats, overdue books, top titles</p>
        </Link>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
