import React from 'react'
import { Pencil, Trash2, Tag, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { type Product, STATUS_CONFIG, CATEGORY_OPTIONS } from '@/types/product'
import { formatPrice, timeAgo } from '@/utils/format'

interface ProductListItemProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const statusVariantMap = {
  active: 'success',
  inactive: 'neutral',
  out_of_stock: 'danger',
} as const

const ProductListItem = React.memo(function ProductListItem({
  product,
  onEdit,
  onDelete,
}: ProductListItemProps) {
  const statusConfig = STATUS_CONFIG[product.status]
  const categoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label ?? product.category

  return (
    <div className="animate-fade-in flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-brand-blue/25 hover:shadow-md">
      {/* Status badge */}
      <div className="shrink-0">
        <Badge variant={statusVariantMap[product.status]} dot>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="font-medium text-foreground truncate text-sm">{product.name}</h3>
          <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0">{product.sku}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{product.description}</p>
      </div>

      {/* Category */}
      <span className="hidden md:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Tag size={11} />
        {categoryLabel}
      </span>

      {/* Updated at */}
      <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Clock size={11} />
        {timeAgo(product.updatedAt)}
      </span>

      {/* Price */}
      <span className="font-bold text-sm text-foreground shrink-0 tabular-nums">
        {formatPrice(product.price)}
      </span>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          aria-label={`Editar ${product.name}`}
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product)}
          aria-label={`Excluir ${product.name}`}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
})

export { ProductListItem }
