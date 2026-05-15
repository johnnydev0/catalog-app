# Catálogo de Itens

SPA de gerenciamento de catálogo de produtos. Permite listar, criar, editar e excluir produtos, com busca textual e filtros por status e categoria.

## Funcionalidades

- Listagem de produtos em grid responsivo (1 → 2 → 3 colunas)
- Criação e edição via drawer lateral com validação em tempo real
- Exclusão com confirmação e remoção otimista da UI
- Busca por nome, descrição ou SKU
- Filtros por status e categoria
- Cards de estatísticas (total, ativos, inativos, esgotados)
- Toasts de feedback para operações CRUD
- Rede simulada com delay aleatório e 10% de chance de erro

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Estilização | Tailwind CSS 4 |
| Estado assíncrono | TanStack Query 5 |
| Formulários | React Hook Form 7 + Zod 4 |
| Componentes UI | shadcn/ui (Radix primitives) |
| Ícones | Lucide React |
| Persistência | localStorage |
| Testes | Vitest + Testing Library |

## Instalação e uso

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Os dados de seed são carregados automaticamente na primeira execução.

```bash
npm run build   # build de produção (tsc + vite)
npm run test    # suíte de testes
```

## Decisões Técnicas

### Vite em vez de Next.js
O projeto é uma SPA client-side pura — sem SEO, sem SSR, sem rotas de API. O Vite entrega exatamente o necessário com HMR instantâneo e build em segundos. Next.js adicionaria Server Components, App Router e a distinção `"use client"` sem resolver nenhum problema real do escopo. O desafio valoriza "solução simples, funcional, bem organizada" — complexidade desnecessária é um risco, não um diferencial.

### Arquitetura em camadas (não por domínio)
Organização por camada técnica (`components/`, `hooks/`, `services/`, `utils/`) em vez de feature folders. O projeto tem um único domínio (catálogo de produtos) — criar `features/products/` com tudo dentro seria adicionar uma pasta intermediária sem ganho real. A service layer e os custom hooks já estão isolados: se o projeto crescesse para múltiplos domínios, a migração seria mover arquivos, não refatorar lógica.

### TanStack Query como camada de estado assíncrono
Gerenciar chamadas assíncronas manualmente (`useState` + `useEffect` + `try/catch/finally`) gera boilerplate repetitivo e não resolve cache, retry nem invalidação. O TanStack Query entrega isso de graça: `isLoading`/`isError` automáticos, retry configurável (2 tentativas), cache com `staleTime`, e `invalidateQueries` após mutações para manter a lista sempre atualizada.

### Simulação de rede com erro
O service simula delay aleatório (400–800ms) e **10% de chance de falha** em toda operação. Isso exercita os dois caminhos: o feliz (skeleton → dados) e o infeliz (toast de erro → retry automático do TanStack Query). Sem simulação de erro, loading states e tratamento de falha ficariam no código mas nunca seriam demonstrados.

### Optimistic update na exclusão
Ao confirmar a exclusão, o produto é removido do cache imediatamente via `onMutate` — a UI responde sem esperar a "API". Se a chamada falhar, o estado anterior é restaurado via rollback com o snapshot salvo no contexto da mutation. Não aplicamos optimistic update em criação/edição porque o drawer fecha ao submeter e o refetch é rápido — o ganho de UX não justifica a complexidade de IDs temporários e merge de estado.

### Preço em centavos
`price` é armazenado como inteiro em centavos para evitar imprecisão de ponto flutuante (`0.1 + 0.2 !== 0.3`). O formulário aceita entrada em reais (`"49,90"`) e converte na submissão. A exibição usa `formatPrice()` para formatar em BRL (`R$ 49,90`).

### Separação de concerns nos hooks
`useProducts` centraliza dados (query + mutations + filtros + stats). `useCatalogActions` encapsula o estado de UI (drawer aberto/fechado, produto em edição, confirmação de exclusão). Essa separação mantém `CatalogPage` puramente declarativo — sem lógica de estado espalhada no componente.

### Filtros como estado local
Os filtros (busca, status, categoria) vivem em `useState` dentro de `useProducts` e derivam `filteredProducts` via `useMemo`. Não há sincronização com URL/query params — decisão consciente por ser uma SPA sem roteamento. Se adicionássemos rotas, migraríamos para `useSearchParams`.

### Zod + React Hook Form
O schema Zod vive em `utils/validation.ts` e serve dois propósitos: alimenta o `zodResolver` do formulário (validação em runtime com mensagens em PT-BR) e é importado nos testes unitários (mesmo schema valida os mesmos cenários). Um único ponto de verdade para regras de validação.

## Estrutura

```
src/
├── components/
│   ├── ui/          # Button, Input, Select, Badge, Drawer, Toast, ConfirmDialog, EmptyState, LoadingSkeleton
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── FilterBar.tsx
│   ├── StatsCards.tsx
│   └── Layout.tsx
├── pages/
│   └── CatalogPage.tsx
├── hooks/
│   ├── useProducts.ts
│   └── useCatalogActions.ts
├── services/
│   └── productService.ts
├── types/
│   └── product.ts
├── utils/
│   ├── validation.ts
│   └── format.ts
├── data/
│   └── seeds.ts
└── test/
    ├── validation.test.ts
    └── components.test.tsx
```
