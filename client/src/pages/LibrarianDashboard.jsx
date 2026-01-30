import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LibrarianDashboard = () => {
  const [pendingIssues, setPendingIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Librarian Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.userInfo}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Pending Book Issue Requests ({pendingIssues.length})
          </h2>

          {loading ? (
            <div style={styles.loading}>Loading pending requests...</div>
          ) : pendingIssues.length === 0 ? (
            <div style={styles.empty}>No pending requests</div>
          ) : (
            <div style={styles.issuesList}>
              {pendingIssues.map((issue) => (
                <div key={issue._id} style={styles.issueCard}>
                  <div style={styles.issueHeader}>
                    <h3 style={styles.issueTitle}>{issue.bookId?.title}</h3>
                    <span style={styles.badge}>Pending</span>
                  </div>
                  
                  <div style={styles.issueDetails}>
                    <div style={styles.detailRow}>
                      <strong>Book Details:</strong>
                      <div style={styles.detailContent}>
                        <p>Author: {issue.bookId?.author}</p>
                        <p>ISBN: {issue.bookId?.isbn}</p>
                        <p>
                          Available Copies: {issue.bookId?.availableCopies}
                        </p>
                      </div>
                    </div>

                    <div style={styles.detailRow}>
                      <strong>User Details:</strong>
                      <div style={styles.detailContent}>
                        <p>Name: {issue.userId?.name}</p>
                        <p>Email: {issue.userId?.email}</p>
                        <p>Role: {issue.userId?.role}</p>
                      </div>
                    </div>

                    <div style={styles.detailRow}>
                      <strong>Request Date:</strong>
                      <span>{formatDate(issue.createdAt)}</span>
                    </div>

                    <div style={styles.detailRow}>
                      <strong>Expected Due Date:</strong>
                      <span>{formatDate(issue.dueDate)}</span>
                    </div>
                  </div>

                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => handleApprove(issue._id)}
                      style={styles.approveButton}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(issue._id)}
                      style={styles.rejectButton}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  userInfo: {
    fontSize: '14px',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '22px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  issuesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  issueCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fafafa',
  },
  issueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  issueTitle: {
    margin: 0,
    color: '#333',
    fontSize: '20px',
  },
  badge: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  issueDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  detailContent: {
    marginLeft: '20px',
    marginTop: '5px',
  },
  detailContent p: {
    margin: '4px 0',
    color: '#555',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  approveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  rejectButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default LibrarianDashboard;
