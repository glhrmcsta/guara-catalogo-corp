import { useState } from 'react'
import { marca, linhas, CATEGORY_GROUPS, CATEGORY_LABELS } from '../utils/catalog'

export default function Header({ onCatalogoClick, onSelectTodas, onSelectLinha, onSelectCategoria }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const goToCatalogo = (event) => {
    event.preventDefault()
    onCatalogoClick()
  }

  // Only real mouse/trackpad input opens the preview — on touch, "hover"
  // events either don't fire or fire as a same-tap ghost right before the
  // click, so gating on this keeps a single tap going straight to onClick
  // instead of eating the first tap on the panel.
  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const openMenu = () => {
    if (canHover()) setMenuOpen(true)
  }

  const closeMenu = () => setMenuOpen(false)

  // onBlur fires for any descendant losing focus (React delegates it as
  // focusout), so this also covers tabbing out of a link/button inside the
  // panel — only close once focus actually leaves the whole wrapper.
  const closeIfFocusLeft = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeMenu()
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <span className="site-header__logo" role="img" aria-label={marca.nome} />

        <nav className="site-header__nav" aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>

          {/* Single wrapper owns both the trigger and the panel so hover
              state is tracked once, on the combined area, instead of on
              separate elements — mousing from the link into the panel
              never sees a "gap" that closes it. A plain click on
              "Catálogo" still navigates straight to the catalog; hover is
              just a preview, not a picker. On touch, canHover() keeps the
              panel from ever opening, so a tap goes straight to onClick. */}
          <div className="mega-menu" onMouseEnter={openMenu} onMouseLeave={closeMenu} onFocus={openMenu} onBlur={closeIfFocusLeft}>
            <a href="#catalogo" className="mega-menu__trigger" onClick={goToCatalogo}>
              Catálogo
            </a>

            <div className={`mega-menu__panel${menuOpen ? ' mega-menu__panel--open' : ''}`}>
              <div className="mega-menu__card">
                <button type="button" className="mega-menu__todas" onClick={onSelectTodas}>
                  Ver todas as peças
                  <span className="mega-menu__todas-arrow" aria-hidden="true">
                    →
                  </span>
                </button>

                <div className="mega-menu__categorias-grid">
                  {CATEGORY_GROUPS.map((grupo) =>
                    grupo.slugs.length === 1 ? (
                      // A single-category group has nothing to list under
                      // it — the kicker itself becomes the (only) link.
                      <button
                        key={grupo.label}
                        type="button"
                        className="mega-menu__kicker mega-menu__kicker--link"
                        onClick={() => onSelectCategoria(grupo.slugs[0])}
                      >
                        {grupo.label}
                      </button>
                    ) : (
                      <div key={grupo.label} className="mega-menu__categorias-col">
                        <p className="mega-menu__kicker">{grupo.label}</p>
                        <ul className="mega-menu__categorias-list">
                          {grupo.slugs.map((categoria) => (
                            <li key={categoria}>
                              <button type="button" onClick={() => onSelectCategoria(categoria)}>
                                {CATEGORY_LABELS[categoria]}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>

                <hr className="mega-menu__divider" />

                <p className="mega-menu__kicker">Ver por linhas</p>

                {linhas.map((linha) => (
                  <button
                    key={linha.slug}
                    type="button"
                    className="mega-menu__linha"
                    onClick={() => onSelectLinha(linha.slug)}
                  >
                    <span
                      className={`product-card__linha-badge product-card__linha-badge--${linha.slug} mega-menu__linha-badge`}
                    >
                      {linha.nome}
                    </span>
                    <span className="mega-menu__linha-titulo">{linha.titulo}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
