import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import "../styles/Home.css";

export default function Home() {
  return (
    <main className="home-page">
      <Hero
        title="Élevage des Ruby de Jade"
        subtitle="Chien-loup tchécoslovaque — Passion, respect et harmonie avec la nature"
      />

      {/* === About Section === */}
      <section className="about-preview">
        <div className="content">
          <h2>Notre Histoire</h2>
          <p>
            Bienvenue à l’Élevage des Ruby de Jade. Situé dans un cadre naturel
            au cœur de la campagne, notre élevage se consacre à la passion du
            Chien-loup tchécoslovaque. Nous mettons un point d’honneur à
            respecter le bien-être, la socialisation et l’équilibre de nos
            chiens.
          </p>
          <p>
            Chaque portée est le fruit d’un travail réfléchi, d’une sélection
            rigoureuse, et d’un amour profond pour cette race noble et fière.
          </p>
        </div>
      </section>

      {/* === Dogs Section === */}
      <section className="dogs-preview">
        <h2>Nos Chiens</h2>
        <p>
          Découvrez nos reproducteurs et nos femelles, sélectionnés pour leur
          caractère équilibré et leur beauté conforme au standard de la race.
        </p>
        <Gallery />
      </section>

      {/* === Puppies Section === */}
      <section className="puppies-preview">
        <h2>Nos Chiots</h2>
        <p>
          Nos chiots grandissent dans un environnement familial, entourés
          d’attention et de soins. Ils sont prêts à rejoindre leur future
          famille dans les meilleures conditions possibles.
        </p>
      </section>

      {/* === Contact Preview === */}
      <section className="contact-preview">
        <h2>Nous Contacter</h2>
        <p>
          Pour toute question ou pour en savoir plus sur nos chiots disponibles,
          n’hésitez pas à{" "}
          <a href="/contact" className="contact-link">
            nous contacter
          </a>.
        </p>
      </section>
    </main>
  );
}
