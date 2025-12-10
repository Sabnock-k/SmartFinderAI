import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = ({ adminOnly = false, redirectToLogin = true } = {}) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (redirectToLogin) navigate("/login");
      setAuthChecked(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      if (adminOnly && decoded.is_admin !== true) {
        navigate("/");
      }
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");

      if (redirectToLogin) navigate("/login");
    }

    setAuthChecked(true);
  }, []);

  return { user, authChecked };
};

export default useAuth;
