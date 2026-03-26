import { useAuth } from '../context/AuthContext';

const TopBar = () => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--topbar-bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 0 var(--border)',
    }}>
      {/* Search */}
      <div className="topbar-search">
        <span style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          fontSize: '14px',
          pointerEvents: 'none',
        }}>
          🔍
        </span>
        <input type="text" placeholder="Search..." />
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Filter */}
        <button className="topbar-icon-btn" title="Filters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
        </button>

        {/* Notifications */}
        <button className="topbar-icon-btn" title="Notifications">
          🔔
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger)',
            border: '1.5px solid #fff',
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }} />

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="topbar-avatar">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
