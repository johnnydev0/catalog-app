import { type ReactNode } from 'react'
import { Package } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Package size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Catálogo de Itens</h1>
              <p className="text-xs text-muted-foreground">Gerencie seus produtos</p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export { Layout }
