import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const STATUS_BADGE = {
  Issued: 'badge-success',
  Overdue: 'badge-danger',
  Pending: 'badge-warning',
  Returned: 'badge-muted',
};

const ACCENT_COLORS = ['#2563eb', '#16a34a', '#b45309', '#7c3aed', '#0891b2', '#dc2626'];

const TAB_STYLE = (active) => ({
  padding: '10px 20px',
  border: 'none',
  background: 'transparent',
  fontSize: '14px',
  fontWeight: active ? 700 : 500,
  color: active ? 'var(--primary)' : 'var(--text-secondary)',
  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
  marginBottom: '-2px',
  cursor: 'pointer',
  transition: 'all 0.15s',
  fontFamily: 'inherit',
});

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks]         = useState([]);
  const [myIssues, setMyIssues]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'books') fetchBooks();
    else fetchMyIssues();
  }, [activeTab, search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const res = await api.get('/books', { params });
      setBooks(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      const res = await api.get('/issues');
      setMyIssues(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestIssue = async (bookId) => {
    if (!window.confirm('Request to issue this book?')) return;
    try {
      await api.post('/issues/request', { bookId });
      alert('Book issue request submitted!');
      fetchMyIssues();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request book');
    }
  };

  const handleReturn = async (issueId) => {
    if (!window.confirm('Return this book?')) return;
    try {
      await api.put(`/issues/${issueId}/return`);
      alert('Book returned successfully!');
      fetchMyIssues();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to return book');
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString();
  const activeIssues = myIssues.filter(i => i.status === 'Issued' || i.status === 'Overdue');

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-sub">Welcome back, {user?.name} — browse books or check your issued items.</p>
        </div>
        <span className="badge badge-warning" style={{ fontSize: '13px', padding: '6px 14px' }}>
          {activeIssues.length} Active
        </span>
      </div>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
        <button style={TAB_STYLE(activeTab === 'books')} onClick={() => setActiveTab('books')}>
          Browse Books
        </button>
        <button style={TAB_STYLE(activeTab === 'myIssues')} onClick={() => setActiveTab('myIssues')}>
          My Books ({activeIssues.length})
        </button>
      </div>

      {activeTab === 'books' && (
        <>
          <div className="search-row">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="form-input"
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '48px' }}>📚</span>
              <p>No books found</p>
            </div>
          ) : (
            <div className="book-grid">
              {books.map((book, i) => (
                <div key={book._id} className="book-card">
                  <div className="book-card-accent" style={{ background: ACCENT_COLORS[i % ACCENT_COLORS.length] }} />
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-meta">ISBN: {book.isbn}</p>
                  <p className="book-meta">Category: {book.category}</p>
                  <div className="book-footer flex-between">
                    <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {book.availableCopies}/{book.totalCopies} available
                    </span>
                    <button
                      onClick={() => handleRequestIssue(book._id)}
                      disabled={book.availableCopies === 0}
                      className={`btn btn-sm ${book.availableCopies === 0 ? 'btn-ghost' : 'btn-primary'}`}
                    >
                      {book.availableCopies === 0 ? 'Unavailable' : 'Request'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'myIssues' && (
        <>
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : myIssues.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '48px' }}>📖</span>
              <p>You have not issued any books yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myIssues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <div className="issue-card-header">
                    <div>
                      <h3 className="issue-card-title">{issue.bookId?.title}</h3>
                      <p className="issue-card-meta">by {issue.bookId?.author}</p>
                    </div>
                    <span className={`badge ${STATUS_BADGE[issue.status] || 'badge-muted'}`}>
                      {issue.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>Issued: {fmt(issue.issueDate)}</span>
                    <span>Due: <strong style={{ color: issue.status === 'Overdue' ? 'var(--danger)' : 'inherit' }}>{fmt(issue.dueDate)}</strong></span>
                    {issue.returnDate && <span>Returned: {fmt(issue.returnDate)}</span>}
                  </div>
                  {issue.status === 'Issued' && (
                    <div style={{ marginTop: '12px' }}>
                      <button onClick={() => handleReturn(issue._id)} className="btn btn-outline-danger btn-sm">
                        Return Book
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default StudentDashboard;