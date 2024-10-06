import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedAPI } from '../services/apiServices'; // Import authenticated API group

const useAuthAuthenticated = () => {
  const [user, setUser] = useState(null);  // This will store the user/authentication status
  const [isLoading, setIsLoading] = useState(true);  // This will handle the loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the authenticated API to get account details
        const response = await authenticatedAPI.getAccountDetails();
        
        // If successful, set authenticated to true
        setUser(true);  // You can replace `true` with `response.data` if needed.
      } catch (error) {
        // If error (like 401 Unauthorized), assume not authenticated
        setUser(null);  // Set user to null if authentication fails
      } finally {
        setIsLoading(false);  // Stop loading once the check is done
      }
    };

    checkAuth();
  }, [navigate]);

  return { user, isLoading };
};

export default useAuthAuthenticated;
