import Sidebar from './Sidebar';
import TopBar from './TopBar';

const PageLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--page-bg)' }}>
    <Sidebar />
    <div style={{
      flex: 1,
      marginLeft: '240px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <TopBar />
      <main style={{ flex: 1, padding: '28px 32px', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  </div>
);

export default PageLayout;
