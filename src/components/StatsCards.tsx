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
      iconClass: 'text-brand-cyan',
      iconBg: 'bg-brand-blue/15',
      accentClass: 'bg-brand-blue',
    },
    {
      label: 'Ativos',
      value: stats.ativos,
      icon: CheckCircle,
      iconClass: 'text-green-400',
      iconBg: 'bg-green-500/15',
      accentClass: 'bg-green-500',
    },
    {
      label: 'Inativos',
      value: stats.inativos,
      icon: XCircle,
      iconClass: 'text-white/40',
      iconBg: 'bg-white/8',
      accentClass: 'bg-white/25',
    },
    {
      label: 'Esgotados',
      value: stats.esgotados,
      icon: AlertTriangle,
      iconClass: 'text-red-400',
      iconBg: 'bg-red-500/15',
      accentClass: 'bg-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon, iconClass, iconBg, accentClass }) => (
        <div key={label} className="rounded-xl border border-border bg-card overflow-hidden relative">
          <div className={`absolute top-0 inset-x-0 h-0.5 ${accentClass}`} />
          <div className="p-4 pt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <div className={`rounded-lg p-1.5 ${iconBg}`}>
                <Icon size={14} className={iconClass} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-foreground tracking-tight">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export { StatsCards }
