import { useCallback, useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'

// Native scroll + snap carousel (not the transform-based Carousel.jsx used
// elsewhere) so the browser handles touch/trackpad scrolling for free —
// the photo-dominant cards here need smooth free-scrolling, not discrete
// page jumps.
export default function PieceCarousel({ id, label, products }) {
  const trackRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateEdges()
    const el = trackRef.current
    if (!el) return undefined

    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges, products])

  // Advances by a full viewport's worth of cards (however many happen to
  // fit) rather than one card at a time, and clamps to the actual
  // start/end instead of overshooting — so the last page always lands
  // flush against the final card instead of scrolling past it into a
  // half-empty group.
  const scrollByDirection = (direction) => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const target = Math.max(0, Math.min(el.scrollLeft + direction * el.clientWidth, maxScroll))
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="piece-carousel" id={id}>
      <header className="piece-carousel__header">
        <div className="piece-carousel__heading">
          <h3 className="piece-carousel__label">{label}</h3>
          <span className="piece-carousel__count">{products.length}</span>
        </div>

        <div className="piece-carousel__nav">
          <button
            type="button"
            className={`piece-carousel__arrow${atStart ? ' piece-carousel__arrow--hidden' : ''}`}
            onClick={() => scrollByDirection(-1)}
            aria-label="Peça anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={`piece-carousel__arrow${atEnd ? ' piece-carousel__arrow--hidden' : ''}`}
            onClick={() => scrollByDirection(1)}
            aria-label="Próxima peça"
          >
            ›
          </button>
        </div>
      </header>

      <div className="piece-carousel__bleed">
        <div className="piece-carousel__track" ref={trackRef}>
          {products.map((product) => (
            <div className="piece-carousel__slide" key={`${product.linha}-${product.nome}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
