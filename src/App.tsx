import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import { CatalogPage } from '@/pages/CatalogPage'
import { ToastContainer } from '@/components/ui/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <CatalogPage />
      </Layout>
      <ToastContainer />
    </QueryClientProvider>
  )
}
