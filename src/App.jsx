import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import About from './components/About'
import BrandMarquee from './components/BrandMarquee'
import CatalogSection from './components/CatalogSection'
import ProductModal from './components/ProductModal'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { ProductModalProvider } from './context/ProductModalContext'
import { categoriaDomId } from './utils/catalog'

export default function App() {
  const [query, setQuery] = useState('')
  // 'todas' or a linha slug — which catalog tab is active.
  const [activeTab, setActiveTab] = useState('todas')
  // Category DOM id to scroll to once the 'todas' tab has re-rendered.
  const [pendingCategoriaId, setPendingCategoriaId] = useState(null)

  const scrollToCatalogo = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Header mega menu: clicking "Todas as peças" resets any active linha
  // filter and jumps to the top of the catalog section.
  const selectTodasTab = () => {
    setActiveTab('todas')
    scrollToCatalogo()
  }

  // Header mega menu: clicking a linha name jumps to the catalog with that
  // linha's tab already selected.
  const selectLinhaTab = (slug) => {
    setActiveTab(slug)
    scrollToCatalogo()
  }

  // Header mega menu: clicking a category (Parte de cima/baixo/Acessórios)
  // always shows every linha ("todas") but scrolls straight to that
  // category's carousel instead of the top of the section.
  const selectCategoria = (categoria) => {
    setActiveTab('todas')
    setPendingCategoriaId(categoriaDomId(categoria))
  }

  // Runs after the 'todas' tab has committed its carousels to the DOM, so
  // the target element is guaranteed to exist by the time we look for it.
  useEffect(() => {
    if (!pendingCategoriaId) return
    document.getElementById(pendingCategoriaId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setPendingCategoriaId(null)
  }, [pendingCategoriaId, activeTab])

  return (
    <ProductModalProvider>
      <Header
        onCatalogoClick={scrollToCatalogo}
        onSelectTodas={selectTodasTab}
        onSelectLinha={selectLinhaTab}
        onSelectCategoria={selectCategoria}
      />
      <Hero onExplorarCatalogo={scrollToCatalogo} />

      <TrustBar />
      <About />
      <BrandMarquee />

      <CatalogSection activeTab={activeTab} onTabChange={setActiveTab} query={query} onQueryChange={setQuery} />

      <FAQ />

      <ProductModal />
      <Footer />
      <WhatsAppButton />
    </ProductModalProvider>
  )
}
