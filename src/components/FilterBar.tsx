import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { Search, X, Sparkles, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/types/product'
import type { Product } from '@/types/product'
import { parseNaturalLanguageFilters } from '@/utils/aiSearch'
import type { ParsedFilters } from '@/utils/aiSearch'
import type { SortOption } from '@/hooks/useProducts'

interface Filters {
  search: string
  status: string
  category: string
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  resultCount: number
  totalCount: number
  products: Product[]
}

const ALL = '__all__'

const statusOptions = [
  { value: ALL, label: 'Todos os status' },
  ...STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
]

const categoryOptions = [
  { value: ALL, label: 'Todas as categorias' },
  ...CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Mais recentes' },
  { value: 'date-asc', label: 'Mais antigos' },
  { value: 'name-asc', label: 'Nome A–Z' },
  { value: 'name-desc', label: 'Nome Z–A' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

function countLiteralMatches(products: Product[], term: string): number {
  const q = term.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q),
  ).length
}

function FilterBar({ filters, onChange, sort, onSortChange, resultCount, totalCount, products }: FilterBarProps) {
  const [inputValue, setInputValue] = useState(filters.search)
  const [isSearching, setIsSearching] = useState(false)
  const [aiExtracted, setAiExtracted] = useState<ParsedFilters | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    if (!filters.search && !filters.status && !filters.category) {
      setInputValue('')
      setAiExtracted(null)
      setAiError(null)
    }
  }, [filters.search, filters.status, filters.category])

  const hasFilters = filters.search || filters.status || filters.category
  const isFiltering = Boolean(hasFilters) && resultCount !== totalCount

  function toSelectValue(v: string) {
    return v === '' ? ALL : v
  }

  function fromSelectValue(v: string) {
    return v === ALL ? '' : v
  }

  function handleClear() {
    onChange({ search: '', status: '', category: '' })
    setInputValue('')
    setAiExtracted(null)
    setAiError(null)
  }

  async function handleSearch() {
    const q = inputValue.trim()

    if (!q) {
      onChange({ ...filters, search: '' })
      setAiExtracted(null)
      return
    }

    if (countLiteralMatches(products, q) > 0) {
      setAiExtracted(null)
      onChange({ ...filters, search: q })
      return
    }

    setIsSearching(true)
    setAiError(null)
    try {
      const extracted = await parseNaturalLanguageFilters(q)
      setAiExtracted(extracted)
      onChange(extracted)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erro ao processar busca com IA.')
      onChange({ ...filters, search: q })
    } finally {
      setIsSearching(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') void handleSearch()
  }

  function getStatusLabel(value: string) {
    return STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value
  }

  function getCategoryLabel(value: string) {
    return CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value
  }

  const hasAiExtracted =
    aiExtracted && (aiExtracted.search || aiExtracted.status || aiExtracted.category)

  return (
    <div className="space-y-3">
      {/* Search row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
          />
          <Input
            placeholder="Buscar por nome, descrição ou SKU..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-24 rounded-full h-10"
            aria-label="Buscar produtos"
            disabled={isSearching}
          />
          <button
            onClick={() => void handleSearch()}
            disabled={isSearching}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            aria-label="Executar busca"
          >
            {isSearching ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Search size={13} />
            )}
            Buscar
          </button>
        </div>

        {/* Filter + sort controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="w-40">
            <Select
              options={statusOptions}
              value={toSelectValue(filters.status)}
              onValueChange={(v) => onChange({ ...filters, status: fromSelectValue(v) })}
              placeholder="Status"
            />
          </div>
          <div className="w-48">
            <Select
              options={categoryOptions}
              value={toSelectValue(filters.category)}
              onValueChange={(v) => onChange({ ...filters, category: fromSelectValue(v) })}
              placeholder="Categoria"
            />
          </div>
          <div className="w-40">
            <Select
              options={sortOptions}
              value={sort}
              onValueChange={(v) => onSortChange(v as SortOption)}
              placeholder="Ordenar"
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={handleClear} aria-label="Limpar filtros">
              <X size={14} />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {aiError && <p className="text-sm text-destructive">{aiError}</p>}

      {hasAiExtracted && !aiError && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-violet-500" />
            Busca interpretada por IA:
          </span>
          {aiExtracted!.search && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
              Texto: {aiExtracted!.search}
            </span>
          )}
          {aiExtracted!.status && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
              Status: {getStatusLabel(aiExtracted!.status)}
            </span>
          )}
          {aiExtracted!.category && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
              Categoria: {getCategoryLabel(aiExtracted!.category)}
            </span>
          )}
        </div>
      )}

      {isFiltering && (
        <p className="text-xs text-muted-foreground pl-1">
          {resultCount} de {totalCount} produto{totalCount !== 1 ? 's' : ''} encontrado
          {resultCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

export { FilterBar }
