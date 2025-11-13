import { useState } from "react";
import "../styles/Contact.css";
import contactImg from "../assets/contactimg.jpg";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestbook, setGuestbook] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Merci pour votre message ! Nous vous répondrons dès que possible.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (guestName && guestMessage) {
      setGuestbook([{ name: guestName, message: guestMessage }, ...guestbook]);
      setGuestName("");
      setGuestMessage("");
    }
  };

  return (
    <main className="contact-page">
      <h1>Contact</h1>
      <p className="intro">
        Pour toute question, réservation ou visite, n’hésitez pas à nous contacter.  
        Nous serons ravis d’échanger avec vous 🐾
      </p>

      <div className="contact-content">
        <div className="contact-image">
          <img src={contactImg} alt="Contact Ruby de Jade" />
        </div>

        <div className="contact-info">
          <h2>Élevage des Ruby de Jade</h2>
          <p>📍 6 rue de la Forêt, 68240 Kaysersberg, France</p>
          <p>📞 06 50 87 91 80</p>
          <p>✉️ schneider.sof68@hotmail.fr</p>
        </div>
      </div>

      {/* === Contact Form & Guestbook Inputs === */}
      <div className="contact-sections">
        <section className="contact-form-section">
          <h2>Envoyer un message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Votre message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Envoyer</button>
          </form>
        </section>

        <section className="guestbook-section">
          <h2>Livre d’or</h2>
          <p>
            Laissez un petit mot à propos de votre expérience avec l’élevage ou de votre visite ❤️
          </p>
          <form onSubmit={handleGuestSubmit} className="guestbook-form">
            <input
              type="text"
              placeholder="Votre nom"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
            <textarea
              placeholder="Votre message..."
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Publier</button>
          </form>
        </section>
      </div>

      {/* Guestbook Entries */}
      <section className="guestbook-entries-section">
        {guestbook.length === 0 ? (
          <p>Aucun message pour le moment. Soyez le premier à laisser un mot !</p>
        ) : (
          guestbook.map((entry, index) => (
            <div key={index} className="guestbook-entry">
              <h4>{entry.name}</h4>
              <p>{entry.message}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
} 
