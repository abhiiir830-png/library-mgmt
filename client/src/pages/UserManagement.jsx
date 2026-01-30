import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });
  const { user: currentUser, logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: '', password: '' });
  };

  const handleUpdate = async (userId) => {
    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      };
      
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      await api.put(`/users/${userId}`, updateData);
      alert('User updated successfully!');
      fetchUsers();
      handleCancelEdit();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#6c757d';
      case 'librarian':
        return '#ffc107';
      case 'faculty':
        return '#28a745';
      case 'student':
        return '#007bff';
      default:
        return '#666';
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>User Management</h1>
        <div style={styles.headerRight}>
          <span style={styles.userInfo}>{currentUser?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Users ({users.length})</h2>

          {loading ? (
            <div style={styles.loading}>Loading users...</div>
          ) : users.length === 0 ? (
            <div style={styles.empty}>No users found</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      {editingUser === user._id ? (
                        <>
                          <td style={styles.td}>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              style={styles.input}
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({ ...editForm, email: e.target.value })
                              }
                              style={styles.input}
                            />
                          </td>
                          <td style={styles.td}>
                            <select
                              value={editForm.role}
                              onChange={(e) =>
                                setEditForm({ ...editForm, role: e.target.value })
                              }
                              style={styles.input}
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="librarian">Librarian</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.buttonGroup}>
                              <button
                                onClick={() => handleUpdate(user._id)}
                                style={styles.saveButton}
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                style={styles.cancelButton}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={styles.td}>{user.name}</td>
                          <td style={styles.td}>{user.email}</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.badge,
                                backgroundColor: getRoleColor(user.role),
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.buttonGroup}>
                              <button
                                onClick={() => handleEdit(user)}
                                style={styles.editButton}
                                disabled={user._id === currentUser?.id}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                style={styles.deleteButton}
                                disabled={user._id === currentUser?.id}
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
            </div>
          )}
        </div>
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
    backgroundColor: '#6c757d',
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
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '22px',
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
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
    color: '#333',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  saveButton: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  cancelButton: {
    padding: '6px 12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  input: {
    padding: '6px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
  },
};

export default UserManagement;
