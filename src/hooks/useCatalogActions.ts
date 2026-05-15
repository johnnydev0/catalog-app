import { useState } from 'react'
import type { Product, ProductFormData } from '@/types/product'

type DrawerMode = null | 'create' | 'edit'

type MutateFn<TVariables> = (
  variables: TVariables,
  options?: { onSuccess?: () => void },
) => void

interface UseCatalogActionsParams {
  createProduct: MutateFn<ProductFormData>
  updateProduct: MutateFn<{ id: string; data: ProductFormData }>
  deleteProduct: MutateFn<string>
}

export function useCatalogActions({
  createProduct,
  updateProduct,
  deleteProduct,
}: UseCatalogActionsParams) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Product | undefined>()

  function openCreate() {
    setEditingProduct(undefined)
    setDrawerMode('create')
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setDrawerMode('edit')
  }

  function handleDelete(product: Product) {
    setDeleteConfirm(product)
  }

  function handleCloseDrawer() {
    setDrawerMode(null)
    setEditingProduct(undefined)
  }

  function handleFormSubmit(data: ProductFormData) {
    const onSuccess = () => handleCloseDrawer()
    if (drawerMode === 'create') {
      createProduct(data, { onSuccess })
    } else if (drawerMode === 'edit' && editingProduct) {
      updateProduct({ id: editingProduct.id, data }, { onSuccess })
    }
  }

  function handleConfirmDelete() {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id)
      setDeleteConfirm(undefined)
    }
  }

  return {
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
  }
}
