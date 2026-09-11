export default function Hero({ onExplorarCatalogo }) {
  const scrollToCatalogo = (event) => {
    event.preventDefault()
    onExplorarCatalogo()
  }

  return (
    <section className="hero">
      <img src="/assets/hero/hero-guara.jpg" alt="" className="hero__image" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__inner">
          <h1 className="hero__headline">testado na cozinha. pronto para qualquer equipe.</h1>

          <a href="#catalogo" className="hero__cta" onClick={scrollToCatalogo}>
            Explorar o catálogo
            <span className="hero__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
