// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Listen for logout in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "adminToken" && e.newValue === null) {
        // Admin token was removed from another tab
        setAdmin(null);
      }
      if (e.key === "admin" && e.newValue === null) {
        // Admin was removed from another tab
        setAdmin(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loginAdmin = (adminData, token) => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
    setAdmin(adminData);
  };

  const logoutAdmin = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        // Call logout API
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/admin-logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Admin logout API error:", err);
    } finally {
      // Always clear local storage regardless of API response
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
