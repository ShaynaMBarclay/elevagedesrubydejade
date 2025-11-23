import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
   
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAdminUser(user);
        setIsAdmin(true);
      } else {
       
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
