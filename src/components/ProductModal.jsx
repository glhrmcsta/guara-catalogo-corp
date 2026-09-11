import { useEffect, useState } from 'react'
import { imagePath } from '../utils/catalog'
import { useProductModal } from '../context/ProductModalContext'

export default function ProductModal() {
  const { product, closeProduct } = useProductModal()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [product])

  useEffect(() => {
    if (!product) return undefined

    // Plain `overflow: hidden` on body doesn't reliably stop scrolling on
    // mobile Safari/Chrome — the background can still shift under touch,
    // and unlocking it leaves a stale, mis-painted frame behind that reads
    // as ghosted/doubled text. Pinning the body with `position: fixed` (and
    // restoring the exact scroll offset on close) avoids that class of bug.
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeProduct()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [product, closeProduct])

  if (!product) return null

  const images = product.imagens
  const hasImages = images.length > 0
  const hasMultiple = images.length > 1

  const showPrev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const showNext = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="product-modal-backdrop" onClick={closeProduct}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.nome}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="product-modal__close"
          onClick={closeProduct}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="product-modal__media">
          {hasImages ? (
            <img
              src={imagePath(images[activeIndex])}
              alt={`${product.nome}${hasMultiple ? ` — foto ${activeIndex + 1}` : ''}`}
              className="product-modal__image"
            />
          ) : (
            <div className="product-modal__placeholder">
              <span>foto em breve</span>
            </div>
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                className="product-modal__nav product-modal__nav--prev"
                onClick={showPrev}
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="product-modal__nav product-modal__nav--next"
                onClick={showNext}
                aria-label="Próxima foto"
              >
                ›
              </button>
              <div className="product-modal__dots">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`product-modal__dot${index === activeIndex ? ' product-modal__dot--active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="product-modal__info">
          <h3 className="product-modal__name">{product.nome}</h3>
          {product.genero && <span className="product-modal__genero">{product.genero}</span>}

          {product.caracteristicas.length > 0 && (
            <ul className="product-modal__features">
              {product.caracteristicas.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
