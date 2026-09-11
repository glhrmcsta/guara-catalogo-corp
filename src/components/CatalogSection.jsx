import PieceCarousel from './PieceCarousel'
import SearchBar from './SearchBar'
import {
  CATEGORY_LABELS,
  categoriaDomId,
  groupByCategoria,
  linhas,
  matchesSearch,
  produtos,
  productsByLinha,
} from '../utils/catalog'

const TABS = [{ slug: 'todas', nome: 'Todas' }, ...linhas]

export default function CatalogSection({ activeTab, onTabChange, query, onQueryChange }) {
  const activeLinha = linhas.find((linha) => linha.slug === activeTab) ?? null
  const baseProducts = activeLinha ? productsByLinha(activeLinha.slug) : produtos
  const products = baseProducts.filter((product) => matchesSearch(product, query))
  const categorias = groupByCategoria(products)

  return (
    <section className="catalog-section" id="catalogo">
      <div className="catalog-section__inner">
        <h2 className="catalog-section__title">Conheça nossas peças</h2>

        <div className="catalog-section__toolbar">
          <div className="catalog-section__tabs" role="tablist" aria-label="Filtrar por linha">
            {TABS.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.slug}
                className={`catalog-section__tab${activeTab === tab.slug ? ' catalog-section__tab--active' : ''}`}
                onClick={() => onTabChange(tab.slug)}
              >
                {tab.nome}
              </button>
            ))}
          </div>

          <div className="catalog-section__search">
            <SearchBar value={query} onChange={onQueryChange} />
          </div>
        </div>

        {activeLinha && <p className="catalog-section__descricao">{activeLinha.descricao}</p>}

        <div className="catalog-section__carousels">
          {categorias.length === 0 ? (
            <p className="catalog-section__empty">Nenhuma peça encontrada.</p>
          ) : (
            categorias.map(([categoria, items]) => (
              <PieceCarousel
                key={categoria}
                id={categoriaDomId(categoria)}
                label={CATEGORY_LABELS[categoria] ?? categoria}
                products={items}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
