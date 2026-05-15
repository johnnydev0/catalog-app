import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProductCard } from '@/components/ProductCard'
import { FilterBar } from '@/components/FilterBar'
import type { Product } from '@/types/product'

const mockProduct: Product = {
  id: '1',
  name: 'Notebook Pro',
  description: 'Notebook de alta performance para uso profissional',
  sku: 'NOTE-001',
  price: 4990,
  category: 'electronics',
  status: 'active',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
}

const defaultFilters = { search: '', status: '', category: '' }

describe('ProductCard', () => {
  it('renderiza o nome do produto', () => {
    render(<ProductCard product={mockProduct} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Notebook Pro')).toBeInTheDocument()
  })

  it('renderiza a descrição do produto', () => {
    render(<ProductCard product={mockProduct} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/alta performance/)).toBeInTheDocument()
  })

  it('renderiza o preço formatado em reais', () => {
    render(<ProductCard product={mockProduct} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/49,90/)).toBeInTheDocument()
  })

  it('renderiza o SKU do produto', () => {
    render(<ProductCard product={mockProduct} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('NOTE-001')).toBeInTheDocument()
  })

  it('renderiza badge "Ativo" para status active', () => {
    render(<ProductCard product={mockProduct} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('renderiza badge "Inativo" para status inactive', () => {
    const inativo = { ...mockProduct, status: 'inactive' as const }
    render(<ProductCard product={inativo} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  it('renderiza badge "Esgotado" para status out_of_stock', () => {
    const esgotado = { ...mockProduct, status: 'out_of_stock' as const }
    render(<ProductCard product={esgotado} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Esgotado')).toBeInTheDocument()
  })

  it('chama onEdit com o produto ao clicar no botão editar', () => {
    const onEdit = vi.fn()
    render(<ProductCard product={mockProduct} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /editar notebook pro/i }))
    expect(onEdit).toHaveBeenCalledWith(mockProduct)
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('chama onDelete com o produto ao clicar no botão excluir', () => {
    const onDelete = vi.fn()
    render(<ProductCard product={mockProduct} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /excluir notebook pro/i }))
    expect(onDelete).toHaveBeenCalledWith(mockProduct)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})

describe('FilterBar', () => {
  it('renderiza o campo de busca', () => {
    render(<FilterBar filters={defaultFilters} onChange={vi.fn()} resultCount={5} totalCount={5} />)
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
  })

  it('não exibe o botão limpar quando não há filtros ativos', () => {
    render(<FilterBar filters={defaultFilters} onChange={vi.fn()} resultCount={5} totalCount={5} />)
    expect(screen.queryByRole('button', { name: /limpar/i })).not.toBeInTheDocument()
  })

  it('exibe o botão limpar quando há filtro de busca ativo', () => {
    const filters = { ...defaultFilters, search: 'notebook' }
    render(<FilterBar filters={filters} onChange={vi.fn()} resultCount={2} totalCount={5} />)
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument()
  })

  it('chama onChange com o novo valor ao digitar na busca', () => {
    const onChange = vi.fn()
    render(<FilterBar filters={defaultFilters} onChange={onChange} resultCount={5} totalCount={5} />)
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'notebook' } })
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, search: 'notebook' })
  })

  it('chama onChange com filtros zerados ao clicar em limpar', () => {
    const onChange = vi.fn()
    const filters = { search: 'notebook', status: '', category: '' }
    render(<FilterBar filters={filters} onChange={onChange} resultCount={2} totalCount={5} />)
    fireEvent.click(screen.getByRole('button', { name: /limpar/i }))
    expect(onChange).toHaveBeenCalledWith({ search: '', status: '', category: '' })
  })

  it('exibe a contagem de resultados quando está filtrando', () => {
    const filters = { ...defaultFilters, search: 'notebook' }
    render(<FilterBar filters={filters} onChange={vi.fn()} resultCount={2} totalCount={5} />)
    expect(screen.getByText(/2 de 5/)).toBeInTheDocument()
  })

  it('não exibe contagem quando todos os resultados aparecem', () => {
    const filters = { ...defaultFilters, search: 'notebook' }
    render(<FilterBar filters={filters} onChange={vi.fn()} resultCount={5} totalCount={5} />)
    expect(screen.queryByText(/de 5/)).not.toBeInTheDocument()
  })
})
