import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { toast } from '@/components/ui/Toast';
import type { Product, ProductFormData } from '@/types/product';

interface Filters {
  search: string;
  status: string;
  category: string;
}

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc';

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const [field, direction] = sort.split('-') as [string, 'asc' | 'desc'];
  return [...products].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    if (field === 'name') {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (field === 'price') {
      aVal = a.price;
      bVal = b.price;
    } else {
      aVal = a.updatedAt;
      bVal = b.updatedAt;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function useProducts() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    category: '',
  });

  const [sort, setSort] = useState<SortOption>('date-desc');

  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    retry: 2,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto criado com sucesso!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData<Product[]>(['products']);
      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.filter((p) => p.id !== id) ?? [],
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (err: Error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['products'], context.previous);
      }
      toast.error(err.message);
    },
  });

  const filteredProducts = useMemo(() => {
    const { search, status, category } = filters;
    const term = search.toLowerCase();

    const filtered = products.filter((p) => {
      if (term) {
        const matchesText =
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term);
        if (!matchesText) return false;
      }
      if (status && p.status !== status) return false;
      if (category && p.category !== category) return false;
      return true;
    });

    return sortProducts(filtered, sort);
  }, [products, filters, sort]);

  const stats = useMemo(
    () => ({
      total: products.length,
      ativos: products.filter((p) => p.status === 'active').length,
      inativos: products.filter((p) => p.status === 'inactive').length,
      esgotados: products.filter((p) => p.status === 'out_of_stock').length,
    }),
    [products],
  );

  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
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
    createProduct: createMutation.mutate,
    createProductAsync: createMutation.mutateAsync,
    updateProduct: updateMutation.mutate,
    updateProductAsync: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutate,
    deleteProductAsync: deleteMutation.mutateAsync,
  };
}
