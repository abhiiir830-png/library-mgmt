import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ title = 'Library Management System' }) => {
  const { user, logout, hasRole } = useAuth();

  const getHeaderColor = () => {
    if (!user) return '#007bff';
    switch (user.role) {
      case 'admin':
        return '#6c757d';
      case 'librarian':
        return '#ffc107';
      case 'faculty':
        return '#28a745';
      case 'student':
        return '#007bff';
      default:
        return '#007bff';
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'librarian':
        return '/dashboard/librarian';
      case 'faculty':
        return '/dashboard/faculty';
      case 'student':
        return '/dashboard/student';
      default:
        return '/dashboard';
    }
  };

  return (
    <header style={{ ...styles.header, backgroundColor: getHeaderColor() }}>
      <div style={styles.leftSection}>
        <Link to={user ? getDashboardLink() : '/'} style={styles.titleLink}>
          <h1 style={styles.title}>{title}</h1>
        </Link>
      </div>
      <div style={styles.rightSection}>
        {user ? (
          <>
            <span style={styles.userInfo}>
              {user.name} ({user.role})
            </span>
            {hasRole(['admin']) && (
              <>
                <Link to="/books" style={styles.navLink}>
                  Books
                </Link>
                <Link to="/admin/users" style={styles.navLink}>
                  Users
                </Link>
                <Link to="/admin/reports" style={styles.navLink}>
                  Reports
                </Link>
              </>
            )}
            {hasRole(['librarian']) && (
              <Link to="/admin/reports" style={styles.navLink}>
                Reports
              </Link>
            )}
            <button onClick={logout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navLink}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  titleLink: {
    textDecoration: 'none',
    color: 'white',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  rightSection: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  userInfo: {
    fontSize: '14px',
    marginRight: '10px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Header;
