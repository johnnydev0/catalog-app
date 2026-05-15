import React from 'react'
import { Pencil, Trash2, Tag, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { type Product, STATUS_CONFIG, CATEGORY_OPTIONS } from '@/types/product'
import { formatPrice, timeAgo } from '@/utils/format'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const statusVariantMap = {
  active: 'success',
  inactive: 'neutral',
  out_of_stock: 'danger',
} as const

const ProductCard = React.memo(function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const statusConfig = STATUS_CONFIG[product.status]
  const categoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label ?? product.category

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-card p-5 flex flex-col gap-3 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{product.name}</h3>
        <Badge variant={statusVariantMap[product.status]} dot>
          {statusConfig.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Tag size={12} />
          {categoryLabel}
        </span>
        <span className="font-mono">{product.sku}</span>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <div>
          <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={11} />
            Atualizado {timeAgo(product.updatedAt)}
          </p>
        </div>
        <div className="flex gap-1">
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
    </div>
  )
})

export { ProductCard }
