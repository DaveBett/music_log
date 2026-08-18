import { createContext, useContext, useEffect, useState } from "react";
import {
  login,
  register,
  logout,
  me,
  updateProfile,
  updatePassword
} from "../api/endpoints";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await me();
      setUser(currentUser);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }

  async function signIn(loginValue, password) {
    const data = await login(loginValue, password);

    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function signUp(username, email, password) {
    const data = await register(username, email, password);

    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function signOut() {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("token");
    setUser(null);
  }

  async function updateProfileInfo(username, email) {
    const updatedUser = await updateProfile(username, email);
  
    setUser(updatedUser.user);
  
    return updatedUser;
  }
  
  async function changePassword(
    currentPassword,
    newPassword,
    confirmPassword
  ) {
    await updatePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
  }

  const updateAvatar = (avatarUrl) => {
    setUser(prev => ({
      ...prev,
      avatar_url: avatarUrl
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile: updateProfileInfo,
        changePassword,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}