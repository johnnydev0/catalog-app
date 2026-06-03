import { type ReactNode } from 'react'
import logoClaro from '@/assets/logo-claro.svg'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header
        className="sticky top-0 z-40 shadow-lg relative"
        style={{ background: '#080629' }}
      >
        <div
          className="absolute bottom-0 inset-x-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, #0065ff 0%, #16b8ff 100%)' }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-4">
              <img src={logoClaro} alt="Inbot" className="h-7 w-auto" />
              <div className="hidden sm:block h-5 w-px bg-white/20" />
              <span className="hidden sm:block text-sm font-medium text-white/60">
                Catálogo de Produtos
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export { Layout }
