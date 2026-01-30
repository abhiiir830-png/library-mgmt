import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { user, logout, hasRole } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await api.get('/books', { params });
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);
      fetchBooks(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Library Management System</h1>
        <div style={styles.headerRight}>
          {user ? (
            <>
              <span style={styles.userInfo}>
                {user.name} ({user.role})
              </span>
              {hasRole(['admin']) && (
                <Link to="/books/add" style={styles.addButton}>
                  Add Book
                </Link>
              )}
              <button onClick={logout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <input
            type="text"
            placeholder="Filter by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
                <p style={styles.bookInfo}>Publisher: {book.publisher}</p>
                <p style={styles.bookInfo}>
                  Available: {book.availableCopies} / {book.totalCopies}
                </p>
                <p style={styles.bookInfo}>Shelf: {book.shelfLocation}</p>
                
                <div style={styles.bookActions}>
                  {hasRole(['admin']) && (
                    <>
                      <Link
                        to={`/books/edit/${book._id}`}
                        style={styles.editButton}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
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
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
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
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
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
  bookActions: {
    marginTop: '15px',
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '6px 12px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default BookList;
