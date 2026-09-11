import { marca } from '../utils/catalog'

const REPEATS = 6

// Same loop technique as TrustBar: the track is duplicated once and slides
// exactly one track-width (-50%), so it repeats without a visible seam.
export default function BrandMarquee() {
  const items = Array.from({ length: REPEATS }, () => marca.tagline)

  return (
    <div className="brand-marquee" aria-hidden="true">
      <div className="brand-marquee__track">
        {[...items, ...items].map((text, index) => (
          <span className="brand-marquee__item" key={index}>
            {text}
            <span className="brand-marquee__dot">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
