import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const LibrarianDashboard = () => {
  const [pendingIssues, setPendingIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingIssues();
    // Refresh every 5 seconds
    const interval = setInterval(fetchPendingIssues, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get('/issues/pending');
      setPendingIssues(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (issueId) => {
    if (!window.confirm('Approve this book issue request?')) {
      return;
    }

    try {
      await api.put(`/issues/${issueId}/approve`);
      alert('Issue approved successfully!');
      fetchPendingIssues();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve issue');
    }
  };

  const handleReject = async (issueId) => {
    if (!window.confirm('Reject this book issue request?')) {
      return;
    }

    try {
      await api.put(`/issues/${issueId}/reject`);
      alert('Issue rejected');
      fetchPendingIssues();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject issue');
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString();

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-sub">Welcome back, {user?.name} — manage pending book requests below.</p>
        </div>
        <span className="badge badge-warning" style={{ fontSize:'13px', padding:'6px 14px' }}>
          {pendingIssues.length} Pending
        </span>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : pendingIssues.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize:'48px' }}>✅</span>
          <p>No pending requests — all caught up!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {pendingIssues.map((issue) => (
            <div key={issue._id} className="request-card">
              <div className="request-card-header">
                <div>
                  <h3 style={{ fontSize:'16px', fontWeight:700, color:'var(--text-primary)', margin:'0 0 4px' }}>
                    {issue.bookId?.title}
                  </h3>
                  <p style={{ fontSize:'13px', color:'var(--text-secondary)', margin:0 }}>
                    by {issue.bookId?.author} &nbsp;&middot;&nbsp; ISBN: {issue.bookId?.isbn}
                  </p>
                </div>
                <span className="badge badge-warning">Pending</span>
              </div>

              <div className="request-card-body">
                <div className="request-info-block">
                  <h4>Book Info</h4>
                  <p>Available copies: {issue.bookId?.availableCopies}</p>
                  <p>Requested: {fmt(issue.createdAt)}</p>
                  <p>Due date: {fmt(issue.dueDate)}</p>
                </div>
                <div className="request-info-block">
                  <h4>Requested By</h4>
                  <p>{issue.userId?.name}</p>
                  <p>{issue.userId?.email}</p>
                  <p style={{ textTransform:'capitalize' }}>{issue.userId?.role}</p>
                </div>
              </div>

              <div className="flex-row">
                <button onClick={() => handleApprove(issue._id)} className="btn btn-success btn-sm">✓ Approve</button>
                <button onClick={() => handleReject(issue._id)} className="btn btn-outline-danger btn-sm">✕ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default LibrarianDashboard;
