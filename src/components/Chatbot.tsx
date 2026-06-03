import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Send, Trash2, MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product, ProductFormData } from '@/types/product'
import { runChatTurn, type ChatMessage } from '@/utils/aiChatbot'

interface ChatbotProps {
  products: Product[]
  createProduct: (data: ProductFormData) => Promise<Product>
  updateProduct: (args: { id: string; data: ProductFormData }) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
}

const QUICK_REPLIES = ['Listar produtos', 'Produtos ativos', 'Adicionar produto', 'Ajuda']

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Olá! Eu sou o assistente do catálogo. Posso consultar, adicionar e editar produtos para você. Como posso ajudar? 😊',
  },
]

export function Chatbot({ products, createProduct, updateProduct, deleteProduct }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasUserMessages = messages.some((m) => m.role === 'user')

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

  async function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim()
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
      {/* ── Widget ── */}
      {isOpen && (
        <div
          className="flex flex-col w-[340px] h-[520px] rounded-2xl shadow-2xl overflow-hidden animate-[fade-in_0.2s_ease-out]"
          style={{ border: '1px solid rgba(0,101,255,0.15)' }}
        >
          {/* Header */}
          <div
            className="shrink-0 relative"
            style={{ background: 'linear-gradient(135deg, #0c0a3b 0%, #032550 60%, #03306b 100%)' }}
          >
            <div
              className="absolute bottom-0 inset-x-0 h-[1.5px]"
              style={{ background: 'linear-gradient(90deg, #0065ff 0%, #16b8ff 100%)' }}
            />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #0065ff 0%, #16b8ff 100%)' }}
              >
                IA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">Assistente IA</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-white/60 text-[11px]">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white/90 transition-colors"
                  aria-label="Limpar conversa"
                  title="Limpar conversa"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white/90 transition-colors"
                  aria-label="Fechar chat"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: '#f4f6fb' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div
                      className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: 'linear-gradient(135deg, #0065ff 0%, #16b8ff 100%)' }}
                    >
                      IA
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[76%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                      msg.role === 'user'
                        ? 'text-white rounded-2xl rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm',
                    )}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #0065ff 0%, #0052cc 100%)' }
                        : { border: '1px solid #e8eef8' }
                    }
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Quick replies — only on first bot message before any user input */}
                {i === 0 && !hasUserMessages && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 ml-9">
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => void handleSend(qr)}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#0065ff] text-[#0065ff] bg-white font-medium transition-all hover:bg-[#0065ff] hover:text-white active:scale-95"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div
                  className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: 'linear-gradient(135deg, #0065ff 0%, #16b8ff 100%)' }}
                >
                  IA
                </div>
                <div
                  className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm"
                  style={{ border: '1px solid #e8eef8' }}
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 bg-white" style={{ borderTop: '1px solid #e8eef8' }}>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && void handleSend()}
                placeholder="Digite uma mensagem"
                disabled={isLoading}
                className="flex-1 text-sm rounded-full px-4 py-2 outline-none transition-all disabled:opacity-60 placeholder:text-gray-400 text-gray-800 focus:ring-2 focus:ring-[#0065ff]/20 focus:border-[#0065ff]"
                style={{ background: '#f4f6fb', border: '1px solid #e2eaf5' }}
              />
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() || isLoading}
                className="rounded-full w-9 h-9 flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0 hover:opacity-85"
                style={{ background: 'linear-gradient(135deg, #0065ff 0%, #16b8ff 100%)' }}
                aria-label="Enviar mensagem"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
            <p className="text-center pb-2 text-[10px] text-gray-400">
              Powered by{' '}
              <span className="font-medium" style={{ color: '#0065ff' }}>
                InBot
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 rounded-full text-white flex items-center justify-center transition-all active:scale-95 hover:opacity-90"
        style={{
          background: isOpen ? '#0c0a3b' : 'linear-gradient(135deg, #0065ff 0%, #16b8ff 100%)',
          boxShadow: '0 4px 20px rgba(0, 101, 255, 0.4)',
        }}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir assistente IA'}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
