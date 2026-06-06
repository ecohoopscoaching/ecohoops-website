import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles, Key, AlertTriangle, X } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  askAICoach,
  getSimulatedResponse
} from '../lib/gemini'
import type { ChatMessage } from '../lib/gemini'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: 'model',
    text: "What's good! I'm your AI Coach, powered by the same constraints-led learning principles we train with. I'm here to help you analyze your game, understand our philosophy, or design custom workout plans. Let's get to work. 🏀",
  },
]

export default function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiKey, setApiKey] = useState(getStoredApiKey())
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyInputValue, setKeyInputValue] = useState(getStoredApiKey())
  const [errorMessage, setErrorMessage] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { ref, isVisible } = useScrollReveal(0.05)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault()
    setStoredApiKey(keyInputValue)
    setApiKey(keyInputValue)
    setShowKeyInput(false)
    setErrorMessage('')
  }

  const handleClearKey = () => {
    clearStoredApiKey()
    setApiKey('')
    setKeyInputValue('')
    setErrorMessage('')
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)
    setErrorMessage('')

    if (apiKey) {
      // Live Mode
      try {
        const responseText = await askAICoach(updatedMessages, apiKey)
        setMessages((prev) => [...prev, { role: 'model', text: responseText }])
      } catch (err: any) {
        console.error(err)
        setErrorMessage(err.message || 'Something went wrong. Please check your API Key.')
        // Fallback response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'model',
              text: `[Error: Live call failed. Falling back to Demo response] ${getSimulatedResponse(userMessage)}`,
            },
          ])
        }, 1000)
      } finally {
        setIsTyping(false)
      }
    } else {
      // Demo Mode
      setTimeout(() => {
        const responseText = getSimulatedResponse(userMessage)
        setMessages((prev) => [...prev, { role: 'model', text: responseText }])
        setIsTyping(false)
      }, 1200)
    }
  }

  return (
    <section ref={ref} className="pt-28 pb-10 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-eco-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full px-4 lg:px-8 flex-1 flex flex-col h-[calc(100vh-140px)] relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-eco-blue/20 border border-eco-blue/30 flex items-center justify-center flex-shrink-0 relative">
              <Bot size={28} className="text-eco-blue" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-eco-black"></div>
            </div>
            <div>
              <h1 className="font-display text-3xl uppercase text-white flex items-center gap-2">
                <Sparkles size={20} className="text-eco-blue animate-pulse" />
                AI Coach
              </h1>
              <p className="text-eco-muted-light text-xs font-heading">
                {apiKey ? 'Powered by live Gemini 2.5' : 'Demo Mode (Simulated)'}
              </p>
            </div>
          </div>

          {/* Key configuration */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-eco-surface border border-eco-border rounded-lg text-eco-muted hover:text-white hover:border-eco-blue/30 transition-all font-heading uppercase tracking-wider"
            >
              <Key size={12} />
              {apiKey ? 'Manage Key' : 'Enter API Key'}
            </button>
          </div>
        </motion.div>

        {/* API Key Drawer */}
        <AnimatePresence>
          {showKeyInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-eco-surface border border-eco-border rounded-2xl p-4 mb-6"
            >
              <form onSubmit={handleSaveKey} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full font-heading">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-eco-muted mb-1">
                      Gemini API Key (Google AI Studio)
                    </label>
                    <input
                      type="password"
                      value={keyInputValue}
                      onChange={(e) => setKeyInputValue(e.target.value)}
                      placeholder="AIzaSy..."
                      className="input-field !py-2 !px-3 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none px-4 py-2 bg-eco-blue text-eco-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-eco-blue/80 transition-all shadow-glow-sm"
                    >
                      Save Key
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-heading font-semibold hover:bg-red-500/20 transition-all"
                      >
                        Clear Key
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-eco-muted leading-relaxed font-heading">
                  Saved key is stored in your local browser storage to make client-side requests directly. Get a free key from the{' '}
                  <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-eco-blue underline font-bold">
                    Google AI Studio
                  </a>.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

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
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
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
                        ? 'bg-eco-blue/25 text-eco-blue-light'
                        : 'bg-eco-blue/15 text-eco-blue border border-eco-blue/20'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 md:px-5 md:py-4 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-line ${
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
                <div className="w-10 h-10 rounded-full bg-eco-blue/20 text-eco-blue flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={18} />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-eco-surface2 border border-eco-border rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-eco-blue/60"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-eco-blue/60"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-eco-blue/60"
                  />
                </div>
              </motion.div>
            )}

            {/* Error Notification */}
            {errorMessage && (
              <div className="flex gap-3 justify-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-5 py-3 flex items-center gap-2 max-w-[80%] text-xs font-heading">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-eco-surface2/50 border-t border-eco-border">
            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 md:gap-3 bg-eco-black/50 p-2 rounded-2xl border border-eco-border focus-within:border-eco-blue/50 transition-colors"
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
                placeholder={isTyping ? 'Coach is thinking...' : 'Ask Coach Adrian\'s AI extension...'}
                className="w-full bg-transparent text-white placeholder-eco-muted p-2 md:p-3 outline-none resize-none min-h-[44px] max-h-[120px] text-sm md:text-base scrollbar-hide font-heading"
                rows={1}
                disabled={isTyping}
                style={{ height: input.split('\n').length > 1 ? 'auto' : '44px' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`p-3 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  input.trim() && !isTyping
                    ? 'bg-eco-blue text-eco-black hover:bg-eco-blue/80 shadow-glow-sm'
                    : 'bg-eco-surface text-eco-muted cursor-not-allowed'
                }`}
              >
                {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>

            {/* Suggestion Chips */}
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {[
                'Give me a CLA shooting drill',
                'Explain Constraints-Led Approach',
                'How to fight athlete burnout',
                'Strategy for full-court defense',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  disabled={isTyping}
                  className="text-[11px] px-3.5 py-1.5 rounded-full bg-eco-surface border border-eco-border text-eco-muted-light hover:text-white hover:border-eco-blue/30 transition-all whitespace-nowrap font-heading disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            <p className="text-center text-[10px] text-eco-muted mt-3 font-heading">
              AI Coach provides basketball training guides based on EcoHoops methodology. Consult standard medical advice for health concerns.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
