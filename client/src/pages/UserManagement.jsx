import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLayout from '../components/PageLayout';

const ROLE_BADGE = {
  admin:     'badge-purple',
  librarian: 'badge-warning',
  faculty:   'badge-success',
  student:   'badge-primary',
};

const UserManagement = () => {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm]       = useState({ name: '', email: '', role: '', password: '' });
  const { user: currentUser }         = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role, password: '' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: '', password: '' });
  };

  const handleUpdate = async (userId) => {
    try {
      const data = { name: editForm.name, email: editForm.email, role: editForm.role };
      if (editForm.password) data.password = editForm.password;
      await api.put(`/users/${userId}`, data);
      alert('User updated successfully!');
      fetchUsers();
      handleCancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      alert('User deleted!');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-sub">View, edit, and remove user accounts.</p>
        </div>
        <span className="badge badge-primary" style={{ fontSize: '13px', padding: '6px 14px' }}>
          {users.length} users
        </span>
      </div>

      <div className="card overflow-auto">
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: '48px' }}>👥</span>
            <p>No users found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {editingUser === user._id ? (
                    <>
                      <td>
                        <input
                          className="form-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="form-input"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="librarian">Librarian</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="flex-row">
                          <button onClick={() => handleUpdate(user._id)} className="btn btn-success btn-sm">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="btn btn-ghost btn-sm">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 600 }}>{user.name}</td>
                      <td className="text-secondary text-sm">{user.email}</td>
                      <td>
                        <span className={`badge ${ROLE_BADGE[user.role] || 'badge-muted'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="flex-row">
                          <button
                            onClick={() => handleEdit(user)}
                            disabled={user._id === currentUser?.id}
                            className="btn btn-outline-warning btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={user._id === currentUser?.id}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageLayout>
  );
};

export default UserManagement;