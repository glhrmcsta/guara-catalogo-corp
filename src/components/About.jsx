import { marca } from '../utils/catalog'

export default function About() {
  return (
    <section className="about" id="sobre">
      <div className="about__inner">
        <div className="about__grid">
          <div className="about__photo-col">
            <img
              className="about__photo"
              src="/assets/sobre/sobre-marca-foto.jpg"
              alt="Equipe Guará em ação"
            />
            <div className="about__photo-overlay" />
            <p className="about__kicker">Sobre a marca</p>
          </div>

          <div className="about__body-col">
            {marca.sobre.split('\n\n').map((paragrafo) => (
              <p key={paragrafo} className="about__body">
                {paragrafo}
              </p>
            ))}
            <p className="about__manifesto">{marca.manifesto}</p>
            <hr className="about__divider" />
          </div>
        </div>
      </div>
    </section>
  )
}
