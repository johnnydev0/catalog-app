import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Trash2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product, ProductFormData } from '@/types/product'
import { runChatTurn, type ChatMessage } from '@/utils/aiChatbot'

interface ChatbotProps {
  products: Product[]
  createProduct: (data: ProductFormData) => Promise<Product>
  updateProduct: (args: { id: string; data: ProductFormData }) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Olá! Posso ajudar a consultar e adicionar produtos no catálogo. O que você precisa?',
}

export function Chatbot({ products, createProduct, updateProduct, deleteProduct }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    setIsLoading(true)

    try {
      const reply = await runChatTurn(newHistory, { products, createProduct, updateProduct, deleteProduct })
      setMessages([...newHistory, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `Erro: ${err instanceof Error ? err.message : 'Não foi possível processar sua mensagem.'}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col w-80 h-[500px] rounded-2xl shadow-2xl border border-border bg-card overflow-hidden animate-[fade-in_0.2s_ease-out]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-card text-foreground border-b border-border shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1.5">
                <Sparkles size={14} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-none">Assistente IA</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">Powered by Claude</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([INITIAL_MESSAGE])}
                className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
                aria-label="Limpar conversa"
                title="Limpar conversa"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
                aria-label="Fechar chat"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Bot size={12} className="text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-card text-foreground border border-border rounded-bl-sm shadow-sm',
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot size={12} className="text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-3 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && void handleSend()}
              placeholder="Digite uma mensagem..."
              disabled={isLoading}
              className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 placeholder:text-muted-foreground text-foreground"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              className="rounded-full w-9 h-9 bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/85 transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/85 transition-all active:scale-95"
        aria-label={isOpen ? 'Fechar chat' : 'Abrir assistente IA'}
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </button>
    </div>
  )
}
