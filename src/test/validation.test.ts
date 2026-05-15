import { describe, it, expect } from 'vitest'
import { productSchema } from '@/utils/validation'

const validData = {
  name: 'Produto Válido',
  description: 'Descrição válida com pelo menos dez caracteres aqui',
  sku: 'PROD-001',
  price: 4990,
  category: 'electronics',
  status: 'active' as const,
}

describe('productSchema', () => {
  it('aceita dados válidos sem erros', () => {
    const result = productSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejeita nome com menos de 3 caracteres', () => {
    const result = productSchema.safeParse({ ...validData, name: 'AB' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/3 caracteres/)
  })

  it('rejeita nome com mais de 100 caracteres', () => {
    const result = productSchema.safeParse({ ...validData, name: 'A'.repeat(101) })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/100 caracteres/)
  })

  it('rejeita descrição com menos de 10 caracteres', () => {
    const result = productSchema.safeParse({ ...validData, description: 'Curta' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/10 caracteres/)
  })

  it('rejeita SKU vazio', () => {
    const result = productSchema.safeParse({ ...validData, sku: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/obrigatório/)
  })

  it('rejeita SKU com caracteres inválidos (espaços)', () => {
    const result = productSchema.safeParse({ ...validData, sku: 'SKU invalido!' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/SKU/)
  })

  it('rejeita preço igual a zero', () => {
    const result = productSchema.safeParse({ ...validData, price: 0 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/maior que zero/)
  })

  it('rejeita preço negativo', () => {
    const result = productSchema.safeParse({ ...validData, price: -100 })
    expect(result.success).toBe(false)
  })

  it('rejeita preço não-inteiro (valor em reais em vez de centavos)', () => {
    const result = productSchema.safeParse({ ...validData, price: 49.9 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/inteiro/)
  })

  it('rejeita status fora do enum permitido', () => {
    const result = productSchema.safeParse({ ...validData, status: 'ativo' })
    expect(result.success).toBe(false)
  })
})
