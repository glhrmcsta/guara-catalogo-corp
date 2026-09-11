import { useState } from 'react'

const LOGO_FILES = [
  "acasadoporco.png",
  "bar-brahma.png",
  "bisutti.png",
  "botanikafe.svg",
  "brf.png",
  "buzina.png",
  "cais.png",
  "casa-marambaia.png",
  "casa-siara.svg",
  "charlo.webp",
  "corrientes.webp",
  "dexco.png",
  "esfihasimigrantes.png",
  "formica.png",
  "grsa.png",
  "guaspari.png",
  "hotel-emiliano.png",
  "hotel-fazenda-santa-vitoria.avif",
  "jam.png",
  "lava-fogo-e-carne.avif",
  "le-jazz.svg",
  "lido-di-mare.webp",
  "lina.png",
  "logo-v1592270801.png",
  "m-dias-branco.png",
  "mani.svg",
  "mastercard.png",
  "morada-dos-canyons.png",
  "nou.png",
  "nubank.png",
  "ocean-network.png",
  "oia.png",
  "ouro-minas.webp",
  "pao-de-acucar.png",
  "pipo.png",
  "piu.png",
  "prevent-senior.png",
  "quickly-travel.webp",
  "ravenala-hotel.png",
  "xepa.webp",
  "z-deli.svg",
]

const logoPath = (filename) => `/assets/clientes/${filename}`

// Track is rendered twice back to back and the animation slides exactly one
// track-width (-50%), so the loop seams invisibly instead of jumping/resetting.
export default function TrustBar() {
  const [hoveredKey, setHoveredKey] = useState(null)

  return (
    <section className="trust-bar-section" id="clientes">
      <p className="trust-bar-section__kicker">Marcas que vestem Guará.</p>

      <div className="trust-bar" aria-hidden="true">
        <div className="trust-bar__track">
          {[...LOGO_FILES, ...LOGO_FILES].map((filename, index) => {
            const key = `${filename}-${index}`
            const isHovered = hoveredKey === key

            return (
              <span
                className="trust-bar__logo"
                key={key}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                {/* The full-color <img> only mounts on hover, never sitting in the
                    DOM behind the mask during the default view. Keeping it always
                    present (hidden via CSS) caused a rendering bug in this exact
                    animated + absolutely-positioned + masked stack: some logos'
                    original colors bled through the mask even though the mask
                    tested correctly in isolation — so the safest fix is to never
                    let the real image exist underneath except during the brief
                    moment it's actually being shown. */}
                {isHovered && (
                  <img className="trust-bar__logo-image" src={logoPath(filename)} alt="" />
                )}
                {/* Solid-color mask, shown by default — filter/opacity alone can't
                    equalize logos because it preserves each source's own luminance
                    (a naturally dark mark stays dark, a light one stays light). A
                    mask filled with one flat, fully-opaque color guarantees every
                    logo reads as the exact same tone, regardless of source colors.
                    The whole `mask` shorthand is set in one inline declaration —
                    splitting mask-image (inline) from mask-size/position/repeat
                    (external stylesheet) rendered inconsistently in testing: some
                    logos fell back to the mask's natural size/position instead of
                    `contain`/`center`, showing a cropped fragment instead of the
                    full mark. Setting it all together avoids that. */}
                <span
                  className="trust-bar__logo-mask"
                  style={{
                    WebkitMask: `url(${logoPath(filename)}) center / contain no-repeat`,
                    mask: `url(${logoPath(filename)}) center / contain no-repeat`,
                    opacity: isHovered ? 0 : 1,
                  }}
                />
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
