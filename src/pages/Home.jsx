import Hero from "../components/Hero";
import Gallery from "../components/Gallery";

export default function Home() {
  return (
    <main>
      <Hero
      
        title="Élevage des Ruby de Jade"
        subtitle="Passion et Excellence dans l'élevage de Cavaliers King Charles"
        background="hero.jpg"
      />
      <section className="about-preview">
        <h2>Notre Histoire</h2>
        <p>
          Depuis plusieurs années, nous nous consacrons à l’élevage de Cavaliers King Charles...
        </p>
      </section>
      <Gallery />
    </main>
  );
}
