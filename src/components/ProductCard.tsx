import React from 'react'
import { Pencil, Trash2, Tag, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { type Product, STATUS_CONFIG, CATEGORY_OPTIONS } from '@/types/product'
import { formatPrice, timeAgo } from '@/utils/format'
import productImage from '@/assets/first-product.avif'

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
    <div className="animate-fade-in group rounded-2xl border border-border bg-card overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 hover:border-friendly-blush-dark/30">

      {/* Image */}
      <div className="relative overflow-hidden h-64 shrink-0">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/70 to-transparent" />

        {/* Status badge — top right */}
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariantMap[product.status]} dot className="shadow-sm">
            {statusConfig.label}
          </Badge>
        </div>

        {/* Category pill — bottom left, glass effect */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-card/85 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground shadow-sm border border-white/20">
            <Tag size={10} />
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 flex-1 text-base leading-snug">
            {product.name}
          </h3>
          <span className="font-mono text-[11px] text-muted-foreground/60 shrink-0 mt-0.5">
            {product.sku}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed overflow-hidden max-h-[3.25em] group-hover:max-h-48 transition-[max-height] duration-500 ease-in-out">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <div>
            <p className="text-lg font-bold text-foreground tracking-tight">
              {formatPrice(product.price)}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Clock size={10} />
              {timeAgo(product.updatedAt)}
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
    </div>
  )
})

export { ProductCard }
