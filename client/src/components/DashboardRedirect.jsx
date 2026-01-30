import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }

      // Redirect based on role
      switch (user.role) {
        case 'student':
          navigate('/dashboard/student');
          break;
        case 'faculty':
          navigate('/dashboard/faculty');
          break;
        case 'librarian':
          navigate('/dashboard/librarian');
          break;
        case 'admin':
          navigate('/books');
          break;
        default:
          navigate('/books');
      }
    }
  }, [user, loading, navigate]);

  return <div>Redirecting...</div>;
};

export default DashboardRedirect;
