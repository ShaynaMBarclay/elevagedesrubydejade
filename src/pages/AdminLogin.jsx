import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAdmin } from "../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setIsAdmin, setAdminUser } = useAdmin();

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); 

    try {
      // Sign in with Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Check if user exists in admins collection
      const adminDoc = await getDoc(doc(db, "admins", uid));

      if (!adminDoc.exists()) {
        // User is signed in but not an admin
        setIsAdmin(false);
        setAdminUser(null);
        setError("Vous n'avez pas les droits d'administration.");
        // Optionally sign out non-admin users
        await auth.signOut();
        return;
      }

      // User is an admin
      setIsAdmin(true);
      setAdminUser(userCred.user);
      navigate("/chiens"); // redirect to chiens page

    } catch (err) {
      console.error("Login error:", err);

      // Handle Firebase Auth errors with friendly messages
      if (err.code === "auth/user-not-found") {
        setError("Utilisateur introuvable.");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalide.");
      } else {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
      }
    }
  }

  return (
    <div className="admin-login">
      <h1>Connexion Administrateur</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Se connecter</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
