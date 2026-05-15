import { v4 as uuidv4 } from 'uuid';
import type { Product, ProductFormData } from '@/types/product';
import { seedProducts } from '@/data/seeds';

const STORAGE_KEY = 'catalog-products';

async function simulateNetwork(): Promise<void> {
  const delay = 400 + Math.random() * 400;
  await new Promise((resolve) => setTimeout(resolve, delay));
  if (Math.random() < 0.1) {
    throw new Error('Erro de conexão simulado. Tente novamente.');
  }
}

function loadFromStorage(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Product[];
}

function saveToStorage(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const productService = {
  async getAll(): Promise<Product[]> {
    await simulateNetwork();
    const stored = loadFromStorage();
    if (stored.length === 0) {
      saveToStorage(seedProducts);
      return seedProducts;
    }
    return stored;
  },

  async getById(id: string): Promise<Product | undefined> {
    await simulateNetwork();
    const products = loadFromStorage();
    return products.find((p) => p.id === id);
  },

  async create(data: ProductFormData): Promise<Product> {
    await simulateNetwork();
    const products = loadFromStorage();
    const now = new Date().toISOString();
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    saveToStorage([...products, product]);
    return product;
  },

  async update(id: string, data: ProductFormData): Promise<Product> {
    await simulateNetwork();
    const products = loadFromStorage();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Produto não encontrado.');
    const updated: Product = {
      ...products[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updated;
    saveToStorage(products);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await simulateNetwork();
    const products = loadFromStorage();
    saveToStorage(products.filter((p) => p.id !== id));
  },
};
