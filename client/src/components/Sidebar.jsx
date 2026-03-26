import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  admin: [
    { label: 'Overview',  icon: '⊞', path: '/admin/dashboard' },
    { label: 'Books',     icon: '📚', path: '/books' },
    { label: 'Users',     icon: '👥', path: '/admin/users' },
    { label: 'Reports',   icon: '📊', path: '/admin/reports' },
  ],
  librarian: [
    { label: 'Overview',       icon: '⊞', path: '/dashboard/librarian' },
    { label: 'Reports',        icon: '📊', path: '/admin/reports' },
  ],
  faculty: [
    { label: 'My Dashboard',   icon: '⊞', path: '/dashboard/faculty' },
    { label: 'Browse Books',   icon: '📚', path: '/books' },
  ],
  student: [
    { label: 'My Dashboard',   icon: '⊞', path: '/dashboard/student' },
    { label: 'Browse Books',   icon: '📚', path: '/books' },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const items = user ? (NAV[user.role] || []) : [];

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/');

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '22px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{ fontSize: '26px' }}>📚</span>
        <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          Libra
        </span>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item${isActive(item.path) ? ' active' : ''}`}
          >
            <span style={{ fontSize: '16px', width: '22px', textAlign: 'center', flexShrink: 0 }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User card + logout */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: '10px',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '15px', flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            color: '#fff', fontSize: '13px', fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'capitalize' }}>
            {user?.role}
          </div>
        </div>
        <button onClick={logout} className="sidebar-logout-btn" title="Logout">⏻</button>
      </div>
    </aside>
  );
};

export default Sidebar;
