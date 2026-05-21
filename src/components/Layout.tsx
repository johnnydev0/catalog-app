import { type ReactNode } from 'react'
import { Boxes } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-friendly-blush p-2.5 shadow-sm">
              <Boxes size={22} className="text-friendly-ink" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Catálogo de Itens
              </h1>
              <p className="text-xs text-muted-foreground">Gerencie seus produtos</p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export { Layout }
