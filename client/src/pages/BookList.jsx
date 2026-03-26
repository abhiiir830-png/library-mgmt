import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const ACCENT_COLORS = ['#2563eb', '#16a34a', '#b45309', '#7c3aed', '#0891b2', '#dc2626'];

const BookList = () => {
  const [books, setBooks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const { hasRole } = useAuth();

  useEffect(() => { fetchBooks(); }, [search, category]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await api.get('/books', { params });
      setBooks(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Books</h1>
          <p className="page-sub">{books.length} book{books.length !== 1 ? 's' : ''} in the library</p>
        </div>
        {hasRole(['admin']) && (
          <Link to="/books/add" className="btn btn-primary">+ Add Book</Link>
        )}
      </div>

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
        <input
          className="form-input"
          type="text"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ maxWidth: '220px' }}
        />
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
              <p className="book-meta">Publisher: {book.publisher}</p>
              <p className="book-meta">Shelf: {book.shelfLocation}</p>
              <div className="book-footer flex-between">
                <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {book.availableCopies}/{book.totalCopies} available
                </span>
                {hasRole(['admin']) && (
                  <div className="flex-row">
                    <Link to={`/books/edit/${book._id}`} className="btn btn-outline-warning btn-sm">Edit</Link>
                    <button onClick={() => handleDelete(book._id)} className="btn btn-outline-danger btn-sm">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default BookList;