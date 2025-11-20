import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAdmin } from "../contexts/AdminContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setIsAdmin, setAdminUser } = useAdmin();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // Check if user exists in admins collection
      const uid = userCred.user.uid;
      const adminDoc = await getDoc(doc(db, "admins", uid));

      if (adminDoc.exists()) {
        setIsAdmin(true);
        setAdminUser(userCred.user);
        navigate("/chiens"); // redirect to chiens page
      } else {
        setError("Vous n'avez pas les droits d'administration.");
      }
    } catch (err) {
      setError("Email ou mot de passe invalide");
    }
  }

  return (
    <div className="admin-login">
      <h1>Admin Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
