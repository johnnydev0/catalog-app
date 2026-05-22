import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        success: 'bg-friendly-mint text-green-700',
        neutral: 'bg-neutral-100 text-neutral-600',
        danger: 'bg-friendly-blush text-red-700',
        outline: 'border border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-green-600',
            variant === 'danger' && 'bg-red-600',
            variant === 'neutral' && 'bg-neutral-400',
          )}
        />
      )}
      {children}
    </span>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
