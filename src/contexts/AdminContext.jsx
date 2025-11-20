import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // your firebase.js auth
import { onAuthStateChanged, signOut } from "firebase/auth";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true); // track initial auth state

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in
        setAdminUser(user);
        // Check if this user is an admin
        // You can use custom claims or a Firestore "admins" collection
        // For simplicity, we'll assume every logged-in user is admin
        setIsAdmin(true);
      } else {
        // User logged out
        setAdminUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setAdminUser(null);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, adminUser, setAdminUser, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
