import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const STATUS_COLOR = {
  Issued: 'var(--primary)', Returned: 'var(--success)',
  Overdue: 'var(--danger)', Pending: 'var(--warning)',
};
const ROLE_BADGE = {
  admin: 'badge-purple', librarian: 'badge-warning',
  faculty: 'badge-success', student: 'badge-primary',
};
const ROLE_DOT_COLOR = {
  admin: 'var(--purple)', librarian: 'var(--warning)',
  faculty: 'var(--success)', student: 'var(--primary)',
};
const STAT_META = [
  { key: 'totalBooks',           label: 'Total Books',           color: '#dbeafe', iconColor: '#2563eb', icon: '📚' },
  { key: 'totalUsers',           label: 'Total Users',           color: '#dcfce7', iconColor: '#16a34a', icon: '👥' },
  { key: 'totalIssues',          label: 'Total Issues',          color: '#fef9c3', iconColor: '#b45309', icon: '📋' },
  { key: 'totalAvailableCopies', label: 'Available Copies',      color: '#f3e8ff', iconColor: '#7c3aed', icon: '✅' },
  { key: 'recentIssues',         label: 'Issues (Last 30 Days)', color: '#cffafe', iconColor: '#0891b2', icon: '📈' },
];

const TAB_STYLE = (active) => ({
  padding: '10px 20px', border: 'none', background: 'transparent',
  fontSize: '14px', fontWeight: active ? 700 : 500,
  color: active ? 'var(--primary)' : 'var(--text-secondary)',
  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
  marginBottom: '-2px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
});

const Reports = () => {
  const [activeTab, setActiveTab]       = useState('analytics');
  const [analytics, setAnalytics]       = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading]           = useState(true);
  const { hasRole } = useAuth();

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    else fetchOverdueBooks();
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/overdue');
      setOverdueBooks(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString();
  const ov  = analytics?.overview || {};

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports &amp; Analytics</h1>
          <p className="page-sub">System statistics, overdue books, and popular titles.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--border)', marginBottom: '28px' }}>
        {hasRole(['admin']) && (
          <button style={TAB_STYLE(activeTab === 'analytics')} onClick={() => setActiveTab('analytics')}>
            📈 Analytics
          </button>
        )}
        {(hasRole(['admin']) || hasRole(['librarian'])) && (
          <button style={TAB_STYLE(activeTab === 'overdue')} onClick={() => setActiveTab('overdue')}>
            ⏰ Overdue ({overdueBooks.length})
          </button>
        )}
      </div>

      {activeTab === 'analytics' && (
        loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : analytics ? (
          <>
            <div className="grid-4 mb-24">
              {STAT_META.map(({ key, label, color, iconColor, icon }) => (
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

            <div className="grid-3">
              <div className="detail-panel">
                <div className="detail-panel-header">
                  <h3 className="detail-panel-title">👥 Users by Role</h3>
                </div>
                {Object.entries(analytics.usersByRole).map(([role, count]) => (
                  <div key={role} className="detail-row">
                    <span className="detail-row-label">
                      <span className="role-dot" style={{ background: ROLE_DOT_COLOR[role] || 'var(--text-muted)' }} />
                      <span style={{ textTransform: 'capitalize' }}>{role}</span>
                    </span>
                    <span className="detail-row-value">{count}</span>
                  </div>
                ))}
              </div>

              <div className="detail-panel">
                <div className="detail-panel-header">
                  <h3 className="detail-panel-title">📋 Issues by Status</h3>
                </div>
                {Object.entries(analytics.issuesByStatus).map(([status, count]) => (
                  <div key={status} className="detail-row">
                    <span className="detail-row-label">
                      <span className="role-dot" style={{ background: STATUS_COLOR[status] || 'var(--text-muted)' }} />
                      {status}
                    </span>
                    <span className="detail-row-value">{count}</span>
                  </div>
                ))}
              </div>

              <div className="detail-panel">
                <div className="detail-panel-header">
                  <h3 className="detail-panel-title">🏆 Popular Books</h3>
                </div>
                {analytics.popularBooks.length > 0 ? (
                  analytics.popularBooks.map((book, i) => (
                    <div key={i} className="detail-row">
                      <span className="detail-row-label">
                        <span className="rank-badge">{i + 1}</span>
                        <span>{book.title} <span className="text-muted text-sm">by {book.author}</span></span>
                      </span>
                      <span className="detail-row-value">{book.count}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: '24px' }}>No data yet</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">No analytics data available</div>
        )
      )}

      {activeTab === 'overdue' && (
        loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : overdueBooks.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: '48px' }}>✅</span>
            <p>No overdue books — everything is on track!</p>
          </div>
        ) : (
          <div className="grid-2">
            {overdueBooks.map((issue) => (
              <div key={issue._id} className="card card-pad">
                <div className="flex-between mb-16" style={{ gap: '10px', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {issue.bookId?.title}
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      by {issue.bookId?.author}
                    </p>
                  </div>
                  <span className="badge badge-danger">Overdue</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span>ISBN: {issue.bookId?.isbn}</span>
                  <span>
                    Issued to: <strong style={{ color: 'var(--text-primary)' }}>{issue.userId?.name}</strong>
                    {' '}({issue.userId?.email})
                  </span>
                  <span>
                    Role:{' '}
                    <span className={`badge ${ROLE_BADGE[issue.userId?.role] || 'badge-muted'}`} style={{ fontSize: '11px' }}>
                      {issue.userId?.role}
                    </span>
                  </span>
                  <span>Issue date: {fmt(issue.issueDate)}</span>
                  <span>Due: <strong style={{ color: 'var(--danger)' }}>{fmt(issue.dueDate)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </PageLayout>
  );
};

export default Reports;