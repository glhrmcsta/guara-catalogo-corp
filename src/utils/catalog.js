import catalogo from '../data/catalogo.json'

export const { marca, linhas, produtos } = catalogo

// The catalogo.json `categoria` field only distinguishes 3 macro groups
// (parte de cima / parte de baixo / acessórios). Navigation needs a finer
// breakdown, so it's derived here from `nome` instead of touching the data
// file — each product name is mapped to one of the 9 subcategories below.
const SUBCATEGORIAS = [
  { slug: 'camisetas-polos', label: 'Camisetas e Polos', grupo: 'cima' },
  { slug: 'camisas', label: 'Camisas', grupo: 'cima' },
  { slug: 'dolmas', label: 'Dolmãs', grupo: 'cima' },
  { slug: 'jalecos-coletes', label: 'Jalecos e Coletes', grupo: 'cima' },
  { slug: 'casacos-moletons', label: 'Casacos e Moletons', grupo: 'cima' },
  { slug: 'calcas-bermudas', label: 'Calças e Bermudas', grupo: 'baixo' },
  { slug: 'vestidos-saias', label: 'Vestidos e Saias', grupo: 'baixo' },
  { slug: 'acessorios', label: 'Acessórios', grupo: 'acessorios' },
]

export const CATEGORY_ORDER = SUBCATEGORIAS.map((c) => c.slug)

export const CATEGORY_LABELS = Object.fromEntries(SUBCATEGORIAS.map((c) => [c.slug, c.label]))

// Mega-menu layout: 3 independent groups, "parte de cima"/"parte de baixo"
// each with several categories, "acessórios" flat with one.
const GRUPO_LABELS = {
  cima: 'Parte de cima',
  baixo: 'Parte de baixo',
  acessorios: 'Acessórios',
}

export const CATEGORY_GROUPS = Object.keys(GRUPO_LABELS).map((grupo) => ({
  label: GRUPO_LABELS[grupo],
  slugs: SUBCATEGORIAS.filter((c) => c.grupo === grupo).map((c) => c.slug),
}))

const NOME_TO_CATEGORIA = {
  'camisa cateto em cotton': 'camisas',
  'camisa cateto em tricoline': 'camisas',
  'camisa cateto em linho': 'camisas',
  'camisa cateto tech': 'camisas',
  'camisa cateto manga curta': 'camisas',
  'camisa mawé': 'camisas',
  'camisa safari': 'camisas',

  'camisa polo double cotton': 'camisetas-polos',
  'camisa polo': 'camisetas-polos',
  'camiseta premium e pima': 'camisetas-polos',
  'camiseta dry fit': 'camisetas-polos',

  'jaqueta puffer': 'casacos-moletons',
  'corta vento': 'casacos-moletons',
  'jaqueta bomber': 'casacos-moletons',
  blazer: 'casacos-moletons',
  'moletom gola careca': 'casacos-moletons',

  'calça abaeté': 'calcas-bermudas',
  'calça curumim': 'calcas-bermudas',

  'vestido bartira': 'vestidos-saias',

  'boné dad hat': 'acessorios',
}

function subcategoriaDe(product) {
  return NOME_TO_CATEGORIA[product.nome] ?? null
}

// Stable DOM id for a category's carousel, independent of which catalog
// tab is active — the header mega menu scrolls straight to these.
export function categoriaDomId(categoria) {
  return `categoria-${categoria}`
}

export function imagePath(relativePath) {
  return `/assets/produtos/${relativePath}`
}

const LINHA_BY_SLUG = new Map(linhas.map((linha) => [linha.slug, linha]))

export function linhaNome(slug) {
  return LINHA_BY_SLUG.get(slug)?.nome ?? slug
}

export function productsByLinha(slug) {
  return produtos.filter((p) => p.linha === slug)
}

const LINHA_ORDER = ['autoral', 'assinatura', 'casual']

// The word a product name sorts by — its second word (e.g. "colete
// utilitário" sorts under "utilitário"), or the whole name when it's a
// single word.
function palavraDeOrdenacao(nome) {
  const palavras = nome.trim().split(/\s+/)
  return palavras[1] ?? palavras[0]
}

// Within "camisetas-polos", the polo variants (piquet, double cotton, ...)
// should read as one sub-group after the plain camisetas, rather than
// interleaving with them the way plain alphabetical order would (e.g.
// "Camisa Polo" sorting next to "Camisa" instead of next to the other
// polos). Every other subcategoria has no "polo" in its names, so this is
// a no-op there.
function tipoPecaOrdem(nome) {
  return nome.includes('polo') ? 1 : 0
}

// Peças que não são o "tipo principal" do grupo ficam por último, depois
// de todo mundo (inclusive depois da linha casual): "macacão artsy" não é
// calça/bermuda, "bermuda araticum" é a única bermuda em meio a calças e
// fica logo antes do artsy, "saia jaçanã" não é vestido. Tabela explícita
// por nome — nenhum outro nome bate com isso, então é um no-op nos demais
// grupos.
function ultimoDoGrupoOrdem(nome) {
  if (nome === 'macacão artsy') return 2
  if (nome === 'bermuda araticum') return 1
  if (nome === 'saia jaçanã') return 1
  return 0
}

// Dentro da linha autoral em "calcas-bermudas", "calça arandu" deve ser a
// última do bloco autoral (mas ainda antes da linha casual, que continua
// vindo depois via LINHA_ORDER). Só esse nome é afetado, então é um no-op
// em qualquer outro grupo/linha.
function ultimoDaLinhaOrdem(nome) {
  return nome === 'calça arandu' ? 1 : 0
}

// Dentro de "camisas", "camisa prisma" deve vir logo depois de "camisa
// kansas" e antes de "camisa mawé" — fora da ordem alfabética normal por
// segunda palavra, que poria mawé antes de prisma. Como as duas já caem
// entre "kansas" e "quinoa" alfabeticamente, só essa dupla precisa de
// override; qualquer outro par continua decidido pela ordem alfabética
// normal (retorna null, então o critério é ignorado).
function prismaAntesDeMaweOrdem(nome) {
  if (nome === 'camisa prisma') return 0
  if (nome === 'camisa mawé') return 1
  return null
}

function compareProdutos(a, b) {
  // Manual override: when both products in a comparison carry an explicit
  // `ordem`, it wins outright over every other criterion below. Products
  // without `ordem` (the vast majority) fall straight through to the
  // linha + alphabetical logic exactly as before — this only changes
  // ordering for groups where `ordem` has been set on every item.
  if (a.ordem != null && b.ordem != null) return a.ordem - b.ordem

  const porTipo = tipoPecaOrdem(a.nome) - tipoPecaOrdem(b.nome)
  if (porTipo !== 0) return porTipo
  const porUltimoDoGrupo = ultimoDoGrupoOrdem(a.nome) - ultimoDoGrupoOrdem(b.nome)
  if (porUltimoDoGrupo !== 0) return porUltimoDoGrupo
  const porLinha = LINHA_ORDER.indexOf(a.linha) - LINHA_ORDER.indexOf(b.linha)
  if (porLinha !== 0) return porLinha
  const porUltimoDaLinha = ultimoDaLinhaOrdem(a.nome) - ultimoDaLinhaOrdem(b.nome)
  if (porUltimoDaLinha !== 0) return porUltimoDaLinha
  const porPrismaMawe = prismaAntesDeMaweOrdem(a.nome)
  const porPrismaMawe2 = prismaAntesDeMaweOrdem(b.nome)
  if (porPrismaMawe !== null && porPrismaMawe2 !== null) {
    const porPrisma = porPrismaMawe - porPrismaMawe2
    if (porPrisma !== 0) return porPrisma
  }
  return palavraDeOrdenacao(a.nome).localeCompare(palavraDeOrdenacao(b.nome), 'pt-BR')
}

// Groups products by (derived) subcategoria, following CATEGORY_ORDER, and
// sorts each group by tipo de peça (camisetas before polos), then linha
// (autoral → assinatura → casual), then the product name's second word.
export function groupByCategoria(products) {
  const groups = new Map(CATEGORY_ORDER.map((categoria) => [categoria, []]))
  for (const product of products) {
    const categoria = subcategoriaDe(product)
    if (!categoria) continue
    groups.get(categoria).push(product)
  }
  for (const items of groups.values()) items.sort(compareProdutos)
  return [...groups.entries()].filter(([, items]) => items.length > 0)
}

export function matchesSearch(product, query) {
  if (!query.trim()) return true
  return product.nome.toLowerCase().includes(query.trim().toLowerCase())
}
