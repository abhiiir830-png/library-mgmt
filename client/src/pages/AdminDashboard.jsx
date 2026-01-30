import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.userInfo}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            ...styles.tab,
            ...(activeTab === 'overview' ? styles.activeTab : {}),
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('books')}
          style={{
            ...styles.tab,
            ...(activeTab === 'books' ? styles.activeTab : {}),
          }}
        >
          Manage Books
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tab,
            ...(activeTab === 'users' ? styles.activeTab : {}),
          }}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            ...styles.tab,
            ...(activeTab === 'reports' ? styles.activeTab : {}),
          }}
        >
          Reports
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'overview' && (
          <div style={styles.overview}>
            <h2 style={styles.sectionTitle}>Welcome to Admin Dashboard</h2>
            <div style={styles.quickLinks}>
              <Link to="/books" style={styles.quickLink}>
                <div style={styles.quickLinkCard}>
                  <h3>📚 Manage Books</h3>
                  <p>Add, edit, or delete books</p>
                </div>
              </Link>
              <Link to="/admin/users" style={styles.quickLink}>
                <div style={styles.quickLinkCard}>
                  <h3>👥 Manage Users</h3>
                  <p>View and manage all users</p>
                </div>
              </Link>
              <Link to="/admin/reports" style={styles.quickLink}>
                <div style={styles.quickLinkCard}>
                  <h3>📊 Reports & Analytics</h3>
                  <p>View system statistics</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Book Management</h2>
              <Link to="/books/add" style={styles.addButton}>
                + Add New Book
              </Link>
            </div>
            <p style={styles.infoText}>
              Click "Manage Books" tab or navigate to <Link to="/books">Books</Link> to manage the book inventory.
            </p>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>User Management</h2>
            </div>
            <p style={styles.infoText}>
              Navigate to <Link to="/admin/users">User Management</Link> to view and manage all users.
            </p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Reports & Analytics</h2>
            </div>
            <p style={styles.infoText}>
              Navigate to <Link to="/admin/reports">Reports</Link> to view system analytics and overdue books.
            </p>
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
  overview: {
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
  quickLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  quickLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  quickLinkCard: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  infoText: {
    color: '#666',
    fontSize: '16px',
  },
};

export default AdminDashboard;
