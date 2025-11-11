import "../styles/Hero.css";

export default function Hero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="overlay">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
