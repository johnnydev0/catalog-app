import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  sku: z
    .string()
    .min(1, 'SKU é obrigatório')
    .regex(/^[A-Za-z0-9\-_]+$/, 'SKU deve conter apenas letras, números, hífens e underscores'),
  price: z
    .number()
    .positive('Preço deve ser maior que zero')
    .int('Preço deve ser um valor inteiro em centavos'),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória'),
  status: z.enum(['active', 'inactive', 'out_of_stock'], { error: 'Status inválido' }),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
