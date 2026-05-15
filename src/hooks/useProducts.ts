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

export function useProducts() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    category: '',
  });

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

    return products.filter((p) => {
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
  }, [products, filters]);

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
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
  };
}
