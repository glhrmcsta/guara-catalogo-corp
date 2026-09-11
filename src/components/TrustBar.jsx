import { useEffect, useRef, useState } from 'react'

// Constant scroll speed shared by every group, so a group with 8 logos and
// one with 15 visibly move at the same pace instead of both taking the same
// fixed duration to complete very different distances.
const SPEED_PX_PER_SECOND = 90

const GROUPS = [
  {
    slug: 'empresas',
    label: 'Empresas',
    logos: [
      { file: 'pao-de-acucar.png', nome: 'Pão de Açúcar' },
      { file: 'nubank.png', nome: 'Nu' },
      { file: 'mastercard.png', nome: 'Mastercard' },
      { file: 'brf.png', nome: 'BRF' },
      { file: 'grsa.png', nome: 'GRSA' },
      { file: 'dexco.png', nome: 'Dexco' },
      { file: 'm-dias-branco.png', nome: 'M. Dias Branco' },
      { file: 'formica.png', nome: 'Formica' },
      { file: 'guaspari.png', nome: 'Guaspari' },
      { file: 'prevent-senior.png', nome: 'Prevent Senior' },
      { file: 'jetour.png', nome: 'Jetour' },
      { file: 'livance.png', nome: 'Livance' },
      { file: 'sodexo.png', nome: 'Sodexo' },
      { file: 'g4.png', nome: 'G4' },
      { file: 'uol.png', nome: 'UOL' },
    ],
  },
  {
    slug: 'hotelaria',
    label: 'Hotelaria',
    logos: [
      { file: 'hotel-emiliano.png', nome: 'Emiliano' },
      { file: 'casa-siara.svg', nome: 'Casa Siará' },
      { file: 'casa-marambaia.png', nome: 'Casa Marambaia' },
      { file: 'lido-di-mare.webp', nome: 'Lido di Mare' },
      { file: 'hotel-fazenda-bela-vista.png', nome: 'Hotel Fazenda Bela Vista' },
      { file: 'morada-dos-canyons.png', nome: 'Morada dos Canyons' },
      { file: 'ouro-minas.webp', nome: 'Ouro Minas' },
      { file: 'bisutti.png', nome: 'Bisutti' },
    ],
  },
  {
    slug: 'restaurantes',
    label: 'Restaurantes',
    logos: [
      { file: 'mani.svg', nome: 'Maní' },
      { file: 'botanikafe.svg', nome: 'Botanikafé' },
      { file: 'le-jazz.svg', nome: 'Le Jazz Brasserie' },
      { file: 'bar-brahma.png', nome: 'Bar Brahma' },
      { file: 'acasadoporco.png', nome: 'A Casa do Porco' },
      { file: 'z-deli.svg', nome: 'Z Deli' },
      { file: 'arturito.png', nome: 'Arturito' },
      { file: '348.png', nome: '348' },
    ],
  },
]

const logoPath = (filename) => `/assets/clientes/${filename}`

// Each group is its own independent looping track. The set of logos is
// repeated end to end (at least twice, more if needed — see the effect
// below) and the track is translated by exactly the pixel distance from the
// start of the first repeat to the start of the second one, then reset.
// That distance is measured from the live DOM (not computed from
// width/gap constants) so it's automatically correct at every breakpoint,
// including the ones where logo size and gap change.
function TrustBarGroup({ slug, label, logos }) {
  const [hoveredKey, setHoveredKey] = useState(null)
  const [repeatCount, setRepeatCount] = useState(2)
  const [shiftPx, setShiftPx] = useState(null)
  const containerRef = useRef(null)
  const firstItemRef = useRef(null)
  const secondRepeatItemRef = useRef(null)

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const first = firstItemRef.current
      const secondRepeat = secondRepeatItemRef.current
      if (!container || !first || !secondRepeat) return

      // Distance between the start of repeat #1 and the start of repeat #2
      // — this is the exact width of "one full set + the gap connecting it
      // to the next", which is what the animation must shift by for the
      // loop to be seamless. A percentage-based translateX(-50%) gets this
      // wrong (off by half a gap) as soon as more than 2 repeats exist, and
      // even with exactly 2 — that mismatch is what caused the visible
      // blank seam on every loop.
      const distance = secondRepeat.offsetLeft - first.offsetLeft
      if (distance <= 0) return

      // Enough repeats so the track's total width comfortably exceeds the
      // visible container width even after shifting by one `distance` — the
      // scenario that was breaking narrower groups (fewer logos): the
      // doubled track was sometimes narrower than the viewport, so past a
      // certain point in the animation there was nothing left to show.
      const containerWidth = container.offsetWidth
      const needed = Math.max(2, Math.ceil(containerWidth / distance) + 2)

      setShiftPx(distance)
      setRepeatCount((current) => (current === needed ? current : needed))
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(containerRef.current)
    window.addEventListener('resize', measure)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
    // Re-measure whenever the repeat count changes too: adding repeats can
    // only affect content after the second one, never the first/second
    // markers themselves, but this keeps the container-width check honest
    // after a resize changes how many repeats are actually needed.
  }, [logos, repeatCount])

  const durationSeconds = shiftPx ? shiftPx / SPEED_PX_PER_SECOND : undefined
  const trackStyle =
    shiftPx != null
      ? { '--trust-shift': `-${shiftPx}px`, animationDuration: `${durationSeconds}s` }
      : undefined

  return (
    <div className="trust-bar-group">
      <p className="trust-bar-group__label">{label}</p>

      <div className="trust-bar" ref={containerRef} aria-hidden="true">
        <div className="trust-bar__track" style={trackStyle}>
          {Array.from({ length: repeatCount }, () => logos)
            .flat()
            .map((logo, index) => {
              const key = `${slug}-${logo.file}-${index}`
              const isHovered = hoveredKey === key
              const isFirstItem = index === 0
              const isFirstOfSecondRepeat = index === logos.length

              return (
                <span
                  className="trust-bar__logo"
                  key={key}
                  ref={isFirstItem ? firstItemRef : isFirstOfSecondRepeat ? secondRepeatItemRef : undefined}
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
                    <img className="trust-bar__logo-image" src={logoPath(logo.file)} alt={logo.nome} />
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
                      WebkitMask: `url(${logoPath(logo.file)}) center / contain no-repeat`,
                      mask: `url(${logoPath(logo.file)}) center / contain no-repeat`,
                      opacity: isHovered ? 0 : 1,
                    }}
                  />
                </span>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default function TrustBar() {
  return (
    <section className="trust-bar-section" id="clientes">
      <p className="trust-bar-section__kicker">Marcas que vestem Guará.</p>

      {GROUPS.map((group) => (
        <TrustBarGroup key={group.slug} {...group} />
      ))}
    </section>
  )
}
