import { Navigate } from 'react-router-dom';
import useAuthAdmin from '../hooks/useAuthAdmin';  // Custom hook for auth state

const ProtectedRoutesAdmin = ({ children }) => {
  const { user, isLoading } = useAuthAdmin();  // useAuth manages user state

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoutesAdmin;
