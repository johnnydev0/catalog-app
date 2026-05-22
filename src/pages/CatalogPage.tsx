import { useState } from 'react'
import { Plus, PackageSearch, PackageX, LayoutGrid, LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/hooks/useProducts'
import { useCatalogActions } from '@/hooks/useCatalogActions'
import { ProductCard } from '@/components/ProductCard'
import { ProductListItem } from '@/components/ProductListItem'
import { ProductForm } from '@/components/ProductForm'
import { FilterBar } from '@/components/FilterBar'
import { StatsCards } from '@/components/StatsCards'
import { Chatbot } from '@/components/Chatbot'

import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { Button } from '@/components/ui/Button'

type ViewMode = 'grid' | 'list'

export function CatalogPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const {
    products,
    filteredProducts,
    stats,
    isLoading,
    isError,
    isSaving,
    refetch,
    filters,
    setFilters,
    sort,
    setSort,
    createProduct,
    createProductAsync,
    updateProduct,
    updateProductAsync,
    deleteProduct,
    deleteProductAsync,
  } = useProducts()

  const {
    drawerMode,
    editingProduct,
    deleteConfirm,
    setDeleteConfirm,
    openCreate,
    handleEdit,
    handleDelete,
    handleCloseDrawer,
    handleFormSubmit,
    handleConfirmDelete,
  } = useCatalogActions({ createProduct, updateProduct, deleteProduct })

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
              Produtos
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">Gerencie o catálogo de itens</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-border bg-muted/50 p-1 gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label="Visualização em grade"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-label="Visualização em lista"
                aria-pressed={viewMode === 'list'}
              >
                <LayoutList size={16} />
              </button>
            </div>

            <Button onClick={openCreate} aria-label="Adicionar novo produto">
              <Plus size={16} />
              Novo produto
            </Button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          resultCount={filteredProducts.length}
          totalCount={products.length}
          products={products}
        />

        {isLoading && <LoadingSkeleton />}

        {isError && (
          <EmptyState
            icon={PackageX}
            title="Erro ao carregar produtos"
            description="Não foi possível buscar os produtos. Verifique sua conexão e tente novamente."
            action={{ label: 'Tentar novamente', onClick: () => void refetch() }}
          />
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && products.length > 0 && (
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto encontrado"
            description="Nenhum produto corresponde aos filtros aplicados. Tente limpar os filtros."
            action={{
              label: 'Limpar filtros',
              onClick: () => setFilters({ search: '', status: '', category: '' }),
            }}
          />
        )}

        {!isLoading && !isError && products.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto cadastrado"
            description="Comece adicionando seu primeiro produto ao catálogo."
            action={{ label: 'Adicionar produto', onClick: openCreate }}
          />
        )}

        {!isLoading && !isError && filteredProducts.length > 0 && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        )}

        <Drawer
          open={drawerMode !== null}
          onClose={handleCloseDrawer}
          title={drawerMode === 'create' ? 'Novo produto' : 'Editar produto'}
        >
          {drawerMode !== null && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              isSaving={isSaving}
            />
          )}
        </Drawer>

        <ConfirmDialog
          open={deleteConfirm !== undefined}
          title="Excluir produto"
          message={`Tem certeza que deseja excluir "${deleteConfirm?.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(undefined)}
        />
      </div>

      <Chatbot
        products={products}
        createProduct={createProductAsync}
        updateProduct={updateProductAsync}
        deleteProduct={deleteProductAsync}
      />
    </>
  )
}
