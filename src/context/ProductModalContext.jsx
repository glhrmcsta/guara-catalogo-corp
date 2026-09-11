import { createContext, useContext, useState } from 'react'

const ProductModalContext = createContext(null)

export function ProductModalProvider({ children }) {
  const [product, setProduct] = useState(null)

  const value = {
    product,
    openProduct: setProduct,
    closeProduct: () => setProduct(null),
  }

  return <ProductModalContext.Provider value={value}>{children}</ProductModalContext.Provider>
}

export function useProductModal() {
  const context = useContext(ProductModalContext)
  if (!context) {
    throw new Error('useProductModal must be used within a ProductModalProvider')
  }
  return context
}
