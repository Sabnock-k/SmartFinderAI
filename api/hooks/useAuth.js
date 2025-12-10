import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = ({ redirectToLogin = true } = {}) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthChecked(true); // done checking
      if (redirectToLogin) navigate("/login"); // only redirect when required
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
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
