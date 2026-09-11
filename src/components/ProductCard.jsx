import { useState } from 'react'
import { imagePath, linhaNome } from '../utils/catalog'
import { useProductModal } from '../context/ProductModalContext'

// Shows the front photo by default; hovering (desktop) swaps to the second
// photo when one exists, as a simple front/back preview. Clicking the card
// opens the full-size modal (which has its own front/back toggle).
export default function ProductCard({ product }) {
  const [showSecond, setShowSecond] = useState(false)
  const { openProduct } = useProductModal()
  const hasImages = product.imagens.length > 0
  const hasSecondImage = product.imagens.length > 1

  const activeImage = showSecond && hasSecondImage ? product.imagens[1] : product.imagens[0]

  return (
    <article
      className="product-card"
      onMouseEnter={() => hasSecondImage && setShowSecond(true)}
      onMouseLeave={() => hasSecondImage && setShowSecond(false)}
    >
      <button
        type="button"
        className="product-card__media"
        onClick={() => openProduct(product)}
        aria-label={`Ver detalhes de ${product.nome}`}
      >
        {hasImages ? (
          <img
            src={imagePath(activeImage)}
            alt={product.nome}
            loading="lazy"
            className="product-card__image"
          />
        ) : (
          <div className="product-card__placeholder">
            <span>foto em breve</span>
          </div>
        )}
      </button>

      <div className="product-card__info">
        <h3 className="product-card__name">{product.nome}</h3>

        <div className="product-card__tags">
          <span className={`product-card__linha-badge product-card__linha-badge--${product.linha}`}>
            {linhaNome(product.linha)}
          </span>
          {product.genero && <span className="product-card__genero">{product.genero}</span>}
        </div>
      </div>
    </article>
  )
}
