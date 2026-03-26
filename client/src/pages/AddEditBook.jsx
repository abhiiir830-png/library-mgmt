import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const FIELDS = [
  { name: 'title',         label: 'Title',          type: 'text',   required: true },
  { name: 'author',        label: 'Author',         type: 'text',   required: true },
  { name: 'isbn',          label: 'ISBN',           type: 'text',   required: true },
  { name: 'category',      label: 'Category',       type: 'text',   required: true },
  { name: 'publisher',     label: 'Publisher',      type: 'text',   required: true },
  { name: 'totalCopies',   label: 'Total Copies',   type: 'number', required: true },
  { name: 'shelfLocation', label: 'Shelf Location', type: 'text',   required: true },
];

const AddEditBook = () => {
  const { id } = useParams();
  const isEdit  = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '',
    publisher: '', totalCopies: '', shelfLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => { if (isEdit) fetchBook(); }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      const b   = res.data.data;
      setFormData({
        title: b.title, author: b.author, isbn: b.isbn,
        category: b.category, publisher: b.publisher,
        totalCopies: b.totalCopies.toString(), shelfLocation: b.shelfLocation,
      });
    } catch {
      setError('Failed to load book');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await api.put(`/books/${id}`, formData);
      else        await api.post('/books', formData);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
          <p className="page-sub">
            {isEdit ? 'Update the book details below.' : 'Fill in the details to add a new book to the library.'}
          </p>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: '680px' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid-form">
            {FIELDS.map(({ name, label, type, required }) => (
              <div key={name} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  min={type === 'number' ? 1 : undefined}
                  className="form-input"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="flex-row mt-24">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
            </button>
            <button type="button" onClick={() => navigate('/books')} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default AddEditBook;