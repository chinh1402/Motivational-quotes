import { Navigate } from 'react-router-dom';
import useAuthAuthenticated from '../hooks/useAuthAuthenticated.jsx';  // Custom hook for auth state

const ProtectedRoutesAuthenticated = ({ children }) => {
  const { user, isLoading } = useAuthAuthenticated();  // useAuth manages user state

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoutesAuthenticated;
