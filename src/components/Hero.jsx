import "../styles/Hero.css";

export default function Hero({ title, subtitle, background }) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${background})` }}>
      <div className="overlay">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
