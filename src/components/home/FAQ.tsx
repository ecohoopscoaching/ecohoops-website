import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FAQS = [
  {
    question: 'Where is EcoHoops located?',
    answer: 'Our youth basketball training, programs, and rep team practices are located in Mississauga, Ontario, utilizing local school and community gymnasiums.'
  },
  {
    question: 'What ages do you coach?',
    answer: 'We offer youth basketball programs for boys and girls aged 6 to 16, ranging from developmental training groups (EcoHoops Jr.) to competitive rep teams.'
  },
  {
    question: 'Do you offer rep teams?',
    answer: 'Yes! We support competitive rep basketball in Mississauga. Our rep teams participate in different competitive leagues and tournaments across the GTA.'
  },
  {
    question: 'Is EcoHoops only for elite players?',
    answer: 'No. EcoHoops is built on the philosophy that every kid belongs. We have programs for beginners (EcoHoops Jr.) as well as competitive divisions for experienced players.'
  },
  {
    question: 'Do you offer girls basketball programs?',
    answer: 'Yes! We have a dedicated girls basketball in Mississauga designed to build confidence, skill, and leadership in a highly supportive, pressure-free environment.'
  },
  {
    question: 'How do I sign up for Jr. NBA/Jr. WNBA programming?',
    answer: 'You can join the parent priority waitlist directly on our homepage! We will notify you first as soon as program dates, age divisions, and registration details are finalized.'
  },
  {
    question: 'How do parents register for EcoHoops programs?',
    answer: 'You can register online through our website, join the Jr. NBA/Jr. WNBA waitlist, or contact our coaching team directly at ecohoopscoaching@gmail.com.'
  }
]

export default function FAQ() {
  const { ref, isVisible } = useScrollReveal(0.05)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section ref={ref} id="faq" className="relative py-24 overflow-hidden bg-eco-black border-t border-eco-border/40">
      {/* Glow decorations */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-eco-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Common Questions</span>
          <h2 className="font-display text-4xl uppercase text-white">
            PARENT <span className="gradient-text">FAQ</span>
          </h2>
          <p className="text-eco-muted-light text-sm max-w-xl mx-auto mt-4">
            Everything you need to know about our Mississauga basketball training, tryouts, and philosophy.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = activeIndex === i
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 * i }}
                className="glow-card overflow-hidden"
                style={{
                  background: isOpen ? 'linear-gradient(135deg, #0d1627, #0f1c35)' : 'linear-gradient(135deg, #0b1120, #0c1527)',
                  borderColor: isOpen ? 'rgba(151,179,210,0.3)' : undefined
                }}
              >
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle size={18} className={isOpen ? 'text-eco-blue' : 'text-eco-muted'} />
                    <span className="font-heading font-semibold text-white text-base md:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-eco-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-white/5 text-eco-muted-light text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
