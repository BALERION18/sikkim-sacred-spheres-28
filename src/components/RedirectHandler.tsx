import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const RedirectHandler = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && userRole) {
      // Redirect users to their appropriate dashboards after login
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'guide':
          navigate('/guide/dashboard');
          break;
        case 'user':
          navigate('/user/home');
          break;
        default:
          navigate('/');
          break;
      }
    }
  }, [user, userRole, loading, navigate]);

  return null;
};