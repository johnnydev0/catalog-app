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
    { label: 'Total', value: stats.total, icon: Package, className: 'text-primary' },
    { label: 'Ativos', value: stats.ativos, icon: CheckCircle, className: 'text-green-600' },
    { label: 'Inativos', value: stats.inativos, icon: XCircle, className: 'text-neutral-500' },
    { label: 'Esgotados', value: stats.esgotados, icon: AlertTriangle, className: 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon, className }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon size={16} className={className} />
          </div>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
      ))}
    </div>
  )
}

export { StatsCards }
