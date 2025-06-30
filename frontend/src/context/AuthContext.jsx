import React, {
  children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/user/refresh-token`,
            {
              refreshToken: storedRefreshToken,
            }
          );
          const newAccessToken = response.data.data.accessToken;
          const newRefreshedToken = response.data.data.newRefreshToken;

          if (newAccessToken && newRefreshedToken) {
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshedToken);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshedToken);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setAccessToken(null);
            setRefreshToken(null);
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAccessToken(null);
          setRefreshToken(null);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoadingAuth(false);
    };
    checkSession();
  }, []);

  const login = async ({email, password}) => {
    setLoadingAuth(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/login`, {email, password});
      const {
        accessToken: receivedAccessToken,
        refreshToken: receivedRefreshToken,
      } = response.data.data;

      if (receivedAccessToken && receivedRefreshToken) {
        localStorage.setItem("accessToken", receivedAccessToken);
        localStorage.setItem("refreshToken", receivedRefreshToken);
        setAccessToken(receivedAccessToken);
        setRefreshToken(receivedRefreshToken);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, error: "Missing tokens from resposne" };
      }
    } catch (error) {
      setIsLoggedIn(false);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Network error or server unreachable",
      };
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  const AuthContextValue = {
    isLoggedIn,
    loadingAuth,
    accessToken,
    refreshToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};