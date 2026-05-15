import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/types/product'

interface Filters {
  search: string
  status: string
  category: string
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
  totalCount: number
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

function FilterBar({ filters, onChange, resultCount, totalCount }: FilterBarProps) {
  const hasFilters = filters.search || filters.status || filters.category
  const isFiltering = Boolean(hasFilters) && resultCount !== totalCount

  function toSelectValue(v: string) {
    return v === '' ? ALL : v
  }

  function fromSelectValue(v: string) {
    return v === ALL ? '' : v
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Buscar por nome, descrição ou SKU..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
            aria-label="Buscar produtos"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-44">
            <Select
              options={statusOptions}
              value={toSelectValue(filters.status)}
              onValueChange={(v) => onChange({ ...filters, status: fromSelectValue(v) })}
              placeholder="Status"
            />
          </div>
          <div className="w-52">
            <Select
              options={categoryOptions}
              value={toSelectValue(filters.category)}
              onValueChange={(v) => onChange({ ...filters, category: fromSelectValue(v) })}
              placeholder="Categoria"
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ search: '', status: '', category: '' })}
              aria-label="Limpar filtros"
            >
              <X size={16} />
              Limpar
            </Button>
          )}
        </div>
      </div>
      {isFiltering && (
        <p className="text-sm text-muted-foreground">
          {resultCount} de {totalCount} produto{totalCount !== 1 ? 's' : ''} encontrado
          {resultCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

export { FilterBar }
