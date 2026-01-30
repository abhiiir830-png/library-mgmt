import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, hasRole } = useAuth();

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else {
      fetchOverdueBooks();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/overdue');
      setOverdueBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching overdue books:', error);
      alert('Failed to fetch overdue books');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Reports & Analytics</h1>
        <div style={styles.headerRight}>
          <span style={styles.userInfo}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        {hasRole(['admin']) && (
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              ...styles.tab,
              ...(activeTab === 'analytics' ? styles.activeTab : {}),
            }}
          >
            Analytics
          </button>
        )}
        {(hasRole(['admin']) || hasRole(['librarian'])) && (
          <button
            onClick={() => setActiveTab('overdue')}
            style={{
              ...styles.tab,
              ...(activeTab === 'overdue' ? styles.activeTab : {}),
            }}
          >
            Overdue Books ({overdueBooks.length})
          </button>
        )}
      </div>

      <div style={styles.content}>
        {activeTab === 'analytics' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>System Analytics</h2>
            {loading ? (
              <div style={styles.loading}>Loading analytics...</div>
            ) : analytics ? (
              <div style={styles.analyticsGrid}>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{analytics.overview.totalBooks}</h3>
                  <p style={styles.statLabel}>Total Books</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{analytics.overview.totalUsers}</h3>
                  <p style={styles.statLabel}>Total Users</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{analytics.overview.totalIssues}</h3>
                  <p style={styles.statLabel}>Total Issues</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{analytics.overview.totalAvailableCopies}</h3>
                  <p style={styles.statLabel}>Available Copies</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{analytics.overview.recentIssues}</h3>
                  <p style={styles.statLabel}>Issues (Last 30 Days)</p>
                </div>
              </div>

              <div style={styles.detailsSection}>
                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Users by Role</h3>
                  <div style={styles.detailList}>
                    {Object.entries(analytics.usersByRole).map(([role, count]) => (
                      <div key={role} style={styles.detailItem}>
                        <span style={styles.detailLabel}>{role}:</span>
                        <span style={styles.detailValue}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Issues by Status</h3>
                  <div style={styles.detailList}>
                    {Object.entries(analytics.issuesByStatus).map(([status, count]) => (
                      <div key={status} style={styles.detailItem}>
                        <span style={styles.detailLabel}>{status}:</span>
                        <span style={styles.detailValue}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Most Popular Books</h3>
                  <div style={styles.detailList}>
                    {analytics.popularBooks.length > 0 ? (
                      analytics.popularBooks.map((book, index) => (
                        <div key={index} style={styles.detailItem}>
                          <span style={styles.detailLabel}>
                            {index + 1}. {book.title} by {book.author}
                          </span>
                          <span style={styles.detailValue}>{book.count} issues</span>
                        </div>
                      ))
                    ) : (
                      <p style={styles.noData}>No data available</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.empty}>No analytics data available</div>
            )}
          </div>
        )}

        {activeTab === 'overdue' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Overdue Books</h2>
            {loading ? (
              <div style={styles.loading}>Loading overdue books...</div>
            ) : overdueBooks.length === 0 ? (
              <div style={styles.empty}>No overdue books</div>
            ) : (
              <div style={styles.overdueList}>
                {overdueBooks.map((issue) => (
                  <div key={issue._id} style={styles.overdueCard}>
                    <h3 style={styles.overdueTitle}>{issue.bookId?.title}</h3>
                    <p style={styles.overdueInfo}>Author: {issue.bookId?.author}</p>
                    <p style={styles.overdueInfo}>ISBN: {issue.bookId?.isbn}</p>
                    <p style={styles.overdueInfo}>
                      Issued to: {issue.userId?.name} ({issue.userId?.email})
                    </p>
                    <p style={styles.overdueInfo}>
                      Role: {issue.userId?.role}
                    </p>
                    <p style={styles.overdueInfo}>
                      Issue Date: {formatDate(issue.issueDate)}
                    </p>
                    <p style={styles.overdueInfo}>
                      Due Date: <strong style={{ color: '#dc3545' }}>
                        {formatDate(issue.dueDate)}
                      </strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
    backgroundColor: '#6c757d',
    color: 'white',
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
  tabs: {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    borderBottomColor: '#6c757d',
    color: '#6c757d',
    fontWeight: 'bold',
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
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #ddd',
  },
  statValue: {
    margin: '0 0 10px 0',
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  },
  detailsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  detailTitle: {
    margin: '0 0 15px 0',
    color: '#333',
    fontSize: '18px',
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  detailLabel: {
    color: '#555',
    fontSize: '14px',
  },
  detailValue: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  noData: {
    color: '#999',
    fontStyle: 'italic',
  },
  overdueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  overdueCard: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    padding: '20px',
    borderRadius: '8px',
  },
  overdueTitle: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '20px',
  },
  overdueInfo: {
    margin: '6px 0',
    color: '#555',
    fontSize: '14px',
  },
};

export default Reports;
