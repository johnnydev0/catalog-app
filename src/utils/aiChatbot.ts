import Anthropic from '@anthropic-ai/sdk'
import type { Product, ProductFormData } from '@/types/product'
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/types/product'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatContext {
  products: Product[]
  createProduct: (data: ProductFormData) => Promise<Product>
  updateProduct: (args: { id: string; data: ProductFormData }) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
}

interface SearchInput {
  search?: string
  status?: string
  category?: string
}

interface CreateInput {
  name: string
  description: string
  sku: string
  price: number
  category: string
  status: string
}

interface UpdateInput {
  id: string
  name?: string
  description?: string
  sku?: string
  price?: number
  category?: string
  status?: string
}

interface DeleteInput {
  id: string
}

const categoryLabel = (v: string) =>
  CATEGORY_OPTIONS.find((c) => c.value === v)?.label ?? v

const statusLabel = (v: string) =>
  STATUS_OPTIONS.find((s) => s.value === v)?.label ?? v

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)

function filterProducts(products: Product[], input: SearchInput): Product[] {
  const term = (input.search ?? '').toLowerCase()
  return products.filter((p) => {
    if (term) {
      const match =
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      if (!match) return false
    }
    if (input.status && p.status !== input.status) return false
    if (input.category && p.category !== input.category) return false
    return true
  })
}

function summarizeProducts(products: Product[]): string {
  if (products.length === 0) return 'Nenhum produto encontrado com esses critérios.'
  const list = products
    .slice(0, 10)
    .map(
      (p) =>
        `• [ID: ${p.id}] ${p.name} (SKU: ${p.sku} | Preço: ${formatPrice(p.price)} | Status: ${statusLabel(p.status)} | Categoria: ${categoryLabel(p.category)})`,
    )
    .join('\n')
  const suffix = products.length > 10 ? `\n...e mais ${products.length - 10} produto(s).` : ''
  return `Encontrei ${products.length} produto(s):\n${list}${suffix}`
}

const CATEGORY_ENUM = ['electronics', 'clothing', 'food', 'furniture', 'tools', 'other'] as const
const STATUS_ENUM = ['active', 'inactive', 'out_of_stock'] as const

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_products',
    description:
      'Busca produtos no catálogo. Use sempre que o usuário quiser ver, listar, filtrar ou encontrar produtos. Os resultados incluem o ID de cada produto, necessário para update e delete.',
    input_schema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Palavra-chave para buscar no nome, descrição ou SKU',
        },
        status: { type: 'string', enum: [...STATUS_ENUM] },
        category: { type: 'string', enum: [...CATEGORY_ENUM] },
      },
    },
  },
  {
    name: 'create_product',
    description:
      'Cria um novo produto no catálogo. Só chame quando tiver todos os dados obrigatórios.',
    input_schema: {
      type: 'object',
      required: ['name', 'description', 'sku', 'price', 'category', 'status'],
      properties: {
        name: { type: 'string', description: 'Nome do produto' },
        description: { type: 'string', description: 'Descrição (mínimo 10 caracteres)' },
        sku: {
          type: 'string',
          description: 'SKU único. Se não fornecido, gere um (ex: "Mouse Logitech" → "MOUS-LOG-001")',
        },
        price: { type: 'number', description: 'Preço em centavos (ex: R$ 49,90 = 4990)' },
        category: { type: 'string', enum: [...CATEGORY_ENUM] },
        status: { type: 'string', enum: [...STATUS_ENUM], description: "Padrão: 'active'" },
      },
    },
  },
  {
    name: 'update_product',
    description:
      'Atualiza campos de um produto existente. Requer o ID do produto — use search_products primeiro se não souber o ID. Só passe os campos que devem ser alterados.',
    input_schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'ID do produto a ser atualizado' },
        name: { type: 'string' },
        description: { type: 'string' },
        sku: { type: 'string' },
        price: { type: 'number', description: 'Preço em centavos' },
        category: { type: 'string', enum: [...CATEGORY_ENUM] },
        status: { type: 'string', enum: [...STATUS_ENUM] },
      },
    },
  },
  {
    name: 'delete_product',
    description:
      'Exclui permanentemente um produto. Requer o ID do produto. ATENÇÃO: só chame após o usuário confirmar explicitamente a exclusão.',
    input_schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'ID do produto a ser excluído' },
      },
    },
  },
]

const SYSTEM_PROMPT = `Você é um assistente inteligente de catálogo de produtos. Responda sempre em português brasileiro e seja conciso.

## Capacidades (use as ferramentas — nunca invente dados):
- **Buscar**: search_products — os resultados incluem o ID de cada produto
- **Criar**: create_product — colete todos os dados antes de chamar
- **Editar**: update_product — use search_products primeiro para obter o ID; só passe os campos alterados
- **Excluir**: delete_product — OBRIGATÓRIO pedir confirmação antes de chamar

## Regra crítica para exclusão:
Antes de chamar delete_product, SEMPRE pergunte: "Tem certeza que deseja excluir **[nome do produto]**? Esta ação não pode ser desfeita."
Só chame a ferramenta após confirmação explícita do usuário (ex: "sim", "pode excluir", "confirmo").

## Regras para criação:
- Pergunte pelo preço se não foi informado
- Gere SKU se não fornecido: ex "Mouse Logitech" → "MOUS-LOG-001"
- Status padrão: 'active'
- Preços em centavos: R$ 49,90 → 4990

## Categorias:
electronics, clothing, food, furniture, tools, other

## Formato:
- Preços sempre em R$ X,XX
- Seja direto e amigável`

export async function runChatTurn(
  history: ChatMessage[],
  ctx: ChatContext,
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (!apiKey) throw new Error('Chave VITE_ANTHROPIC_API_KEY não configurada no .env.local')

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  let response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: TOOLS,
    messages,
  })

  while (response.stop_reason === 'tool_use') {
    const toolBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    )

    const results: Anthropic.ToolResultBlockParam[] = await Promise.all(
      toolBlocks.map(async (block) => {
        let content: string
        try {
          if (block.name === 'search_products') {
            const filtered = filterProducts(ctx.products, block.input as SearchInput)
            content = summarizeProducts(filtered)
          } else if (block.name === 'create_product') {
            const inp = block.input as CreateInput
            const product = await ctx.createProduct({
              name: inp.name,
              description: inp.description,
              sku: inp.sku,
              price: inp.price,
              category: inp.category,
              status: inp.status as ProductFormData['status'],
            })
            content = `Produto "${product.name}" criado com sucesso! (ID: ${product.id})`
          } else if (block.name === 'update_product') {
            const inp = block.input as UpdateInput
            const existing = ctx.products.find((p) => p.id === inp.id)
            if (!existing) {
              content = `Produto com ID "${inp.id}" não encontrado.`
            } else {
              const updated = await ctx.updateProduct({
                id: inp.id,
                data: {
                  name: inp.name ?? existing.name,
                  description: inp.description ?? existing.description,
                  sku: inp.sku ?? existing.sku,
                  price: inp.price ?? existing.price,
                  category: inp.category ?? existing.category,
                  status: (inp.status ?? existing.status) as ProductFormData['status'],
                },
              })
              content = `Produto "${updated.name}" atualizado com sucesso!`
            }
          } else if (block.name === 'delete_product') {
            const inp = block.input as DeleteInput
            const existing = ctx.products.find((p) => p.id === inp.id)
            await ctx.deleteProduct(inp.id)
            content = `Produto "${existing?.name ?? inp.id}" excluído com sucesso.`
          } else {
            content = 'Ferramenta desconhecida.'
          }
        } catch (err) {
          content = `Erro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`
        }
        return { type: 'tool_result' as const, tool_use_id: block.id, content }
      }),
    )

    messages.push({ role: 'assistant', content: response.content })
    messages.push({ role: 'user', content: results })

    response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    })
  }

  const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  return text?.text ?? 'Desculpe, não consegui processar sua mensagem.'
}
