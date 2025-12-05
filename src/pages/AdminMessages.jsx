import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAdmin } from "../contexts/AdminContext";
import "../styles/AdminMessages.css";

export default function AdminMessages() {
  const { isAdmin } = useAdmin();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "messages", id));
  };

  if (!isAdmin) return <p>Accès refusé.</p>;

  return (
    <div className="admin-messages">
      <h1>Messages reçus</h1>

      {messages.length === 0 ? (
        <p>Aucun message pour le moment.</p>
      ) : (
        messages.map((msg) => (
          <div className="message-card" key={msg.id}>
            <h3>{msg.name}</h3>
            <p><strong>Email :</strong> {msg.email}</p>
            <p>{msg.message}</p>

            {msg.timestamp && (
              <small>
                {msg.timestamp.toDate().toLocaleString("fr-FR", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </small>
            )}

            <button onClick={() => handleDelete(msg.id)} className="delete-btn">
              Supprimer
            </button>
          </div>
        ))
      )}
    </div>
  );
}
