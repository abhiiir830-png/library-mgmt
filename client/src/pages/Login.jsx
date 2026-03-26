import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Left decorative panel ── */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(150deg, #c4b5fd 0%, #ede9f6 55%, #ddd6fe 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Floating decorative circles */}
        <div style={{ position:'absolute', top:'-70px',  right:'-70px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(124,58,237,0.12)' }} />
        <div style={{ position:'absolute', bottom:'50px', left:'-50px',  width:'180px', height:'180px', borderRadius:'50%', background:'rgba(124,58,237,0.08)' }} />
        <div style={{ position:'absolute', top:'38%',    right:'8%',     width:'90px',  height:'90px',  borderRadius:'50%', background:'rgba(124,58,237,0.1)'  }} />

        <div style={{ position:'relative', textAlign:'center', maxWidth:'380px' }}>
          <div style={{ fontSize:'88px', marginBottom:'28px', filter:'drop-shadow(0 8px 20px rgba(124,58,237,0.25))' }}>📚</div>
          <h1 style={{ fontSize:'26px', fontWeight:800, color:'#1e1b4b', marginBottom:'14px', lineHeight:1.3 }}>
            Welcome to Libra
          </h1>
          <p style={{ color:'#5b21b6', fontSize:'14px', lineHeight:1.7, opacity:0.85 }}>
            <br />The Academic Library Management System. <br /><br />
          </p>
          <p style={{ color:'#5b21b6', fontSize:'14px', lineHeight:1.7, opacity:0.85 }}>
            Your complete solution for managing books, and library operations efficiently for academic libraries.
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
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize:'28px', fontWeight:800, color:'var(--text-primary)', marginBottom:'6px' }}>Login</h2>
          <p style={{ color:'var(--text-muted)', fontSize:'14px', marginBottom:'28px' }}>
            Sign in to access your library account
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            <div className="form-group">
              <label className="form-label-accent">Email or Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input form-input-accent"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label-accent">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input form-input-accent"
                placeholder="Enter your password"
              />
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'13px' }}>
              <label style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--text-secondary)', cursor:'pointer' }}>
                <input type="checkbox" style={{ accentColor:'var(--login-accent)' }} />
                Remember Me
              </label>
              <a href="#" style={{ color:'var(--login-accent)', fontWeight:600 }}>Forget Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-login btn-full"
              style={{ padding:'13px', fontSize:'15px', borderRadius:'12px', marginTop:'4px' }}
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--login-accent)', fontWeight:600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
