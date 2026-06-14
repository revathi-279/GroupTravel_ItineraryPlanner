import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService }
from "../services/authService";

const AuthContext =
  createContext();

export const AuthProvider =
({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const login =
  async (data) => {

    const response =
      await authService.login(
        data
      );

    setUser(
      response.user
    );

    return response;
  };

  const register =
  async (data) => {

    const response =
      await authService.register(
        data
      );

    setUser(
      response.user
    );

    return response;
  };

  const logout =
  async () => {

    await authService.logout();

    setUser(null);
  };

  const refreshUser =
  async () => {

    try {

      const response =
        await authService.getProfile();

      setUser(
        response.payload
      );

    } catch {

      setUser(null);
    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    refreshUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated:
          !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
() =>
  useContext(
    AuthContext
  );