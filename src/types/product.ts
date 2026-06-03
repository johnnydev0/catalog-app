export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  status: ProductStatus;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Eletrônicos' },
  { value: 'clothing', label: 'Roupas' },
  { value: 'food', label: 'Alimentos' },
  { value: 'furniture', label: 'Móveis' },
  { value: 'tools', label: 'Ferramentas' },
  { value: 'other', label: 'Outros' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'out_of_stock', label: 'Esgotado' },
] as const;

export const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Ativo', color: 'text-success-700', bg: 'bg-success-100' },
  inactive: { label: 'Inativo', color: 'text-neutral-600', bg: 'bg-neutral-100' },
  out_of_stock: { label: 'Esgotado', color: 'text-danger-700', bg: 'bg-danger-100' },
};
