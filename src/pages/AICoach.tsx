import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: "Hey! I'm your AI Coach. I'm here to help you analyze your game, understand the EcoHoops philosophy, or plan your next workout. What's on your mind?",
  },
]

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { ref, isVisible } = useScrollReveal(0.05)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        "That's a great question. Remember that development is a marathon, not a sprint. Focus on the fundamentals.",
        "In our constraints-led approach, we'd probably set up a 3v3 small-sided game to work on exactly that decision-making process.",
        "I love that mindset. Keep attacking the rim and don't be afraid to make mistakes—that's how we learn.",
        "Make sure you're getting enough reps with your off-hand. The best players are unpredictable because they have no weak side.",
        "Basketball is a game of angles and anticipation. Watch some film on how the pros manipulate screens and try to apply that to your next practice.",
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: randomResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1500)
  }

  return (
    <section ref={ref} className="pt-28 pb-10 min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 lg:px-8 flex-1 flex flex-col h-[calc(100vh-140px)]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-14 h-14 rounded-full bg-eco-orange/20 border border-eco-orange/30 flex items-center justify-center flex-shrink-0 relative">
            <Bot size={28} className="text-eco-orange" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-eco-black"></div>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase text-white flex items-center gap-2">
              <Sparkles size={20} className="text-eco-orange" />
              AI Coach
            </h1>
            <p className="text-eco-muted-light text-sm">Powered by EcoHoops Intelligence</p>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 glow-card flex flex-col overflow-hidden border border-eco-border/50"
        >
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-start gap-3 md:gap-4 max-w-[85%] md:max-w-[75%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.role === 'user'
                        ? 'bg-eco-blue/20 text-eco-blue-light'
                        : 'bg-eco-orange/20 text-eco-orange'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 md:px-5 md:py-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-eco-blue/10 border border-eco-blue/20 text-white rounded-tr-sm'
                        : 'bg-eco-surface2 border border-eco-border text-eco-muted-light rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 max-w-[80%]"
              >
                <div className="w-10 h-10 rounded-full bg-eco-orange/20 text-eco-orange flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={18} />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-eco-surface2 border border-eco-border rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-eco-orange/60"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-eco-orange/60"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-eco-orange/60"
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-eco-surface2/50 border-t border-eco-border">
            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 md:gap-3 bg-eco-black/50 p-2 rounded-2xl border border-eco-border focus-within:border-eco-orange/50 transition-colors"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask Coach anything..."
                className="w-full bg-transparent text-white placeholder-eco-muted p-2 md:p-3 outline-none resize-none min-h-[44px] max-h-[120px] text-sm md:text-base scrollbar-hide"
                rows={1}
                style={{ height: input.split('\n').length > 1 ? 'auto' : '44px' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`p-3 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  input.trim() && !isTyping
                    ? 'bg-eco-orange text-white hover:bg-eco-orange/90 shadow-glow-sm'
                    : 'bg-eco-surface text-eco-muted cursor-not-allowed'
                }`}
              >
                {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>
            <p className="text-center text-[10px] text-eco-muted mt-3">
              AI Coach provides general advice. For specific medical or training plans, consult a professional.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
