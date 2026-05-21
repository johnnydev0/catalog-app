import { Package, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface Stats {
  total: number
  ativos: number
  inativos: number
  esgotados: number
}

interface StatsCardsProps {
  stats: Stats
}

function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      label: 'Total',
      value: stats.total,
      icon: Package,
      bg: 'bg-card border-border',
      iconColor: 'text-foreground/60',
    },
    {
      label: 'Ativos',
      value: stats.ativos,
      icon: CheckCircle,
      bg: 'bg-friendly-mint/30 border-friendly-mint-dark/20',
      iconColor: 'text-green-700',
    },
    {
      label: 'Inativos',
      value: stats.inativos,
      icon: XCircle,
      bg: 'bg-muted border-border',
      iconColor: 'text-neutral-400',
    },
    {
      label: 'Esgotados',
      value: stats.esgotados,
      icon: AlertTriangle,
      bg: 'bg-friendly-blush/30 border-friendly-blush-dark/20',
      iconColor: 'text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon, bg, iconColor }) => (
        <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <Icon size={15} className={iconColor} />
          </div>
          <p className="font-heading text-3xl font-semibold text-foreground tracking-tight">
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

export { StatsCards }
