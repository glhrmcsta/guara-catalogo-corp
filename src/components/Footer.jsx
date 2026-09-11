import { marca } from '../utils/catalog'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__logo" role="img" aria-label={marca.nome} />

        <div className="site-footer__info">
          <p className="site-footer__address">Rua Lisboa, 278, Pinheiros - SP</p>
          <a
            className="site-footer__instagram"
            href="https://instagram.com/use_guara"
            target="_blank"
            rel="noopener noreferrer"
          >
            @use_guara
          </a>
        </div>
      </div>
    </footer>
  )
}
