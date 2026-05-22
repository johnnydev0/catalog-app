import { type ReactNode } from 'react'
import { Boxes, Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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

            <button
              onClick={toggle}
              className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export { Layout }
