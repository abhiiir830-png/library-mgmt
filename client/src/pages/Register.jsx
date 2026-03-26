import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', role:'student' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>

      {/* ── Left decorative panel ── */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(150deg, #a5b4fc 0%, #ede9f6 55%, #c4b5fd 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-70px',  right:'-70px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(124,58,237,0.12)' }} />
        <div style={{ position:'absolute', bottom:'50px', left:'-50px',  width:'180px', height:'180px', borderRadius:'50%', background:'rgba(124,58,237,0.08)' }} />

        <div style={{ position:'relative', textAlign:'center', maxWidth:'380px' }}>
          <div style={{ fontSize:'88px', marginBottom:'28px', filter:'drop-shadow(0 8px 20px rgba(124,58,237,0.25))' }}>🎓</div>
          <h1 style={{ fontSize:'26px', fontWeight:800, color:'#1e1b4b', marginBottom:'14px', lineHeight:1.3 }}>
            Join the Libra Community
          </h1>
          <p style={{ color:'#5b21b6', fontSize:'14px', lineHeight:1.7, opacity:0.85 }}>
            Create your account and get instant access to thousands of books and resources.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        width: '480px',
        minWidth: '360px',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.07)',
        overflowY: 'auto',
      }}>
        <div style={{ width:'100%', maxWidth:'380px', padding:'8px 0' }}>
          <h2 style={{ fontSize:'28px', fontWeight:800, color:'var(--text-primary)', marginBottom:'6px' }}>Register</h2>
          <p style={{ color:'var(--text-muted)', fontSize:'14px', marginBottom:'28px' }}>
            Fill in your details to create an account
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div className="form-group">
              <label className="form-label-accent">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                required className="form-input form-input-accent" placeholder="Enter your full name" />
            </div>

            <div className="form-group">
              <label className="form-label-accent">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                required className="form-input form-input-accent" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label className="form-label-accent">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                required minLength="6" className="form-input form-input-accent" placeholder="Min. 6 characters" />
            </div>

            <div className="form-group">
              <label className="form-label-accent">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select form-input-accent">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-login btn-full"
              style={{ padding:'13px', fontSize:'15px', borderRadius:'12px', marginTop:'4px' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--login-accent)', fontWeight:600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
