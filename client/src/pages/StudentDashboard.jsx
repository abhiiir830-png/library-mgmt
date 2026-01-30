import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const StudentDashboard = () => {
  const [books, setBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('books'); // 'books' or 'myIssues'
  const { user, logout } = useAuth();

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    } else {
      fetchMyIssues();
    }
  }, [activeTab, search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      
      const response = await api.get('/books', { params });
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get('/issues');
      setMyIssues(response.data.data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestIssue = async (bookId) => {
    if (!window.confirm('Request to issue this book?')) {
      return;
    }

    try {
      await api.post('/issues/request', { bookId });
      alert('Book issue request submitted successfully!');
      fetchMyIssues();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to request book');
    }
  };

  const handleReturn = async (issueId) => {
    if (!window.confirm('Return this book?')) {
      return;
    }

    try {
      await api.put(`/issues/${issueId}/return`);
      alert('Book returned successfully!');
      fetchMyIssues();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to return book');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Student Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.userInfo}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('books')}
          style={{
            ...styles.tab,
            ...(activeTab === 'books' ? styles.activeTab : {}),
          }}
        >
          Browse Books
        </button>
        <button
          onClick={() => setActiveTab('myIssues')}
          style={{
            ...styles.tab,
            ...(activeTab === 'myIssues' ? styles.activeTab : {}),
          }}
        >
          My Books ({myIssues.filter(i => i.status === 'Issued' || i.status === 'Overdue').length})
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'books' && (
          <>
            <div style={styles.searchBar}>
              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {loading ? (
              <div style={styles.loading}>Loading books...</div>
            ) : books.length === 0 ? (
              <div style={styles.empty}>No books found</div>
            ) : (
              <div style={styles.bookGrid}>
                {books.map((book) => (
                  <div key={book._id} style={styles.bookCard}>
                    <h3 style={styles.bookTitle}>{book.title}</h3>
                    <p style={styles.bookAuthor}>By {book.author}</p>
                    <p style={styles.bookInfo}>ISBN: {book.isbn}</p>
                    <p style={styles.bookInfo}>Category: {book.category}</p>
                    <p style={styles.bookInfo}>
                      Available: {book.availableCopies} / {book.totalCopies}
                    </p>
                    <button
                      onClick={() => handleRequestIssue(book._id)}
                      disabled={book.availableCopies === 0}
                      style={{
                        ...styles.requestButton,
                        ...(book.availableCopies === 0 ? styles.disabledButton : {}),
                      }}
                    >
                      {book.availableCopies === 0 ? 'Not Available' : 'Request Issue'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'myIssues' && (
          <>
            {loading ? (
              <div style={styles.loading}>Loading your books...</div>
            ) : myIssues.length === 0 ? (
              <div style={styles.empty}>No books issued</div>
            ) : (
              <div style={styles.issuesList}>
                {myIssues.map((issue) => (
                  <div key={issue._id} style={styles.issueCard}>
                    <h3 style={styles.issueTitle}>{issue.bookId?.title}</h3>
                    <p style={styles.issueInfo}>Author: {issue.bookId?.author}</p>
                    <p style={styles.issueInfo}>
                      Status: <span style={{
                        color: issue.status === 'Issued' ? '#28a745' : 
                               issue.status === 'Overdue' ? '#dc3545' : 
                               issue.status === 'Pending' ? '#ffc107' : '#6c757d',
                        fontWeight: 'bold',
                      }}>
                        {issue.status}
                      </span>
                    </p>
                    <p style={styles.issueInfo}>
                      Issue Date: {formatDate(issue.issueDate)}
                    </p>
                    <p style={styles.issueInfo}>
                      Due Date: {formatDate(issue.dueDate)}
                    </p>
                    {issue.returnDate && (
                      <p style={styles.issueInfo}>
                        Return Date: {formatDate(issue.returnDate)}
                      </p>
                    )}
                    {issue.status === 'Issued' && (
                      <button
                        onClick={() => handleReturn(issue._id)}
                        style={styles.returnButton}
                      >
                        Return Book
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
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
    backgroundColor: '#007bff',
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
    borderBottomColor: '#007bff',
    color: '#007bff',
    fontWeight: 'bold',
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  searchBar: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
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
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  bookCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  bookTitle: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '20px',
  },
  bookAuthor: {
    margin: '0 0 8px 0',
    color: '#666',
    fontWeight: '500',
  },
  bookInfo: {
    margin: '4px 0',
    color: '#555',
    fontSize: '14px',
  },
  requestButton: {
    marginTop: '15px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  issuesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  issueCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  issueTitle: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '20px',
  },
  issueInfo: {
    margin: '6px 0',
    color: '#555',
    fontSize: '14px',
  },
  returnButton: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default StudentDashboard;
