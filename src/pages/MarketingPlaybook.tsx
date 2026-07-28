import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, CheckCircle, AlertTriangle, Sparkles, Copy, Check, 
  Search, Target, Lightbulb
} from 'lucide-react'
import { TRANSLATION_DICTIONARY, FIVE_QUESTION_CHECKLIST, POSITIONING_STATEMENT } from '../data/content'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type PlaybookTab = 'generator' | 'checker' | 'dictionary' | 'playbook'

export default function MarketingPlaybook() {
  useDocumentTitle('Marketing Playbook v2')
  const [activeTab, setActiveTab] = useState<PlaybookTab>('generator')

  // Copy Generator State
  const [targetProgram, setTargetProgram] = useState('August Tryouts (Mississauga)')
  const [ageGroup, setAgeGroup] = useState('Grades 5/6, 7/8, 9/10')
  const [channel, setChannel] = useState<'instagram' | 'email' | 'flyer'>('instagram')
  const [copied, setCopied] = useState(false)

  // Copy Checker State
  const [draftCopy, setDraftCopy] = useState(`Your kid practices every week, but when the game gets fast, do they freeze? EcoHoops builds players who stay calm and read the court. Our practices are built like real games so learning transfers when it counts. Tryouts are August 1 & 8 in Mississauga!`)
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true
  })
  const [dictionarySearch, setDictionarySearch] = useState('')

  // Formula Copy Output Generation
  const generateCopy = () => {
    if (channel === 'instagram') {
      return `Your kid practices every week. But when the game gets fast, do they freeze? 🏀

EcoHoops builds players who stay calm, read the court, and figure it out on their own — instead of looking at the bench for answers.

Our practices are built around real game situations, so what your child learns in training actually transfers to real competition.

🏆 PROOF: 98% of EcoHoops parents report noticeable improvement in their child's confidence and decision-making on the court within 6 weeks.

📍 TRYOUTS: August 1 & August 8 in Mississauga
🎒 AGE GROUPS: ${ageGroup}
⚡ Spots are strictly limited per roster.

👉 Register your player today: ecohoops.ca/register (Link in bio)`
    }

    if (channel === 'email') {
      return `Subject: Is your child's basketball training transferring to real games?

Hi Parent,

Have you noticed your child practicing hard all week, only to freeze or panic when game speed picks up on Saturday?

It’s one of the most frustrating things to watch as a parent — knowing how hard they work, but not seeing it show up on the scoreboard.

At EcoHoops, we do things differently.

We don't do static cone drills. We teach basketball the way it's actually played — with live decision-making, game-like pressure, and real defenders.

The result? Players who stay calm under pressure, read the floor, and solve problems on their own.

Details for our upcoming Rep Team Tryouts:
• Dates: August 1 and August 8
• Location: Mississauga, ON
• Divisions: ${ageGroup}

Spots are capped to guarantee high playing time and direct coaching focus.

Reserve your child's tryout spot here: https://ecohoops.ca/register

Coach Adrian
Founder, EcoHoops Basketball`
    }

    return `[FLYER HEADLINE]
DOES YOUR CHILD FREEZE IN FAST-PACED GAMES?

[SUBHEADLINE]
Build a smarter, more confident competitor with EcoHoops Mississauga.

[THE DIFFERENCE]
• Practice looks like real games — so learning actually sticks.
• No shouting or fear — just proven player development.
• Teaches players to read the court and make smart decisions under pressure.

[TRYOUT DATES & LOCATION]
📅 August 1 & August 8 | Mississauga, ON
🏀 Age Groups: ${ageGroup}

[CALL TO ACTION]
Register now before spots fill up: www.ecohoops.ca/register`
  }

  // Scan draft for forbidden jargon
  const scanJargon = () => {
    const textLower = draftCopy.toLowerCase()
    const flagged = TRANSLATION_DICTIONARY.filter(item => 
      textLower.includes(item.neverSay.toLowerCase())
    )
    return flagged
  }

  const flaggedJargon = scanJargon()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredDictionary = TRANSLATION_DICTIONARY.filter(item =>
    item.neverSay.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    item.sayInstead.toLowerCase().includes(dictionarySearch.toLowerCase())
  )

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <span className="tag mb-3 inline-flex items-center gap-2">
            <Sparkles size={14} className="text-eco-blue" />
            Internal Growth & Copy Engine
          </span>
          <h1 className="font-display text-hero uppercase leading-none">
            <span className="text-white">MARKETING </span>
            <span className="gradient-text">PLAYBOOK v2</span>
          </h1>
          <p className="text-eco-muted-light text-base max-w-2xl mt-3">
            The mandatory guide and interactive generator for all EcoHoops promotions, tryout ads, and parent communication.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-eco-surface border border-eco-blue/20 flex items-center gap-3">
          <Target className="text-eco-orange flex-shrink-0" size={24} />
          <div className="text-xs">
            <span className="font-heading font-bold uppercase text-white block">The Core Rule</span>
            <span className="text-eco-muted-light font-body">Sell the transformation, not the training.</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2 border-b border-white/10">
        {[
          { id: 'generator' as PlaybookTab, label: 'Formula Copy Generator', icon: Sparkles },
          { id: 'checker' as PlaybookTab, label: '5-Question Copy Checker', icon: CheckCircle },
          { id: 'dictionary' as PlaybookTab, label: 'Parent Translation Dictionary', icon: BookOpen },
          { id: 'playbook' as PlaybookTab, label: 'Full Playbook Document', icon: Lightbulb },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border-t border-x ${
              activeTab === tab.id
                ? 'bg-eco-surface border-eco-blue/30 text-eco-blue shadow-glow-sm border-b-2 border-b-eco-blue'
                : 'border-transparent text-eco-muted-light hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: FORMULA COPY GENERATOR */}
        {activeTab === 'generator' && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-6 bg-eco-surface p-6 md:p-8 rounded-2xl border border-eco-border">
              <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
                <Sparkles size={18} className="text-eco-blue" />
                Configure Copy Parameters
              </h2>

              <div className="space-y-4 text-xs font-heading">
                <div>
                  <label className="block text-eco-muted-light uppercase tracking-wider mb-2">Campaign Target</label>
                  <select 
                    value={targetProgram} 
                    onChange={(e) => setTargetProgram(e.target.value)}
                    className="w-full bg-eco-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-blue text-xs font-body"
                  >
                    <option>August Tryouts (Mississauga)</option>
                    <option>Junior Hoops (Ages 5-11)</option>
                    <option>Girls Basketball Program</option>
                    <option>General Club Registration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-eco-muted-light uppercase tracking-wider mb-2">Age Group / Grade</label>
                  <input 
                    type="text" 
                    value={ageGroup} 
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full bg-eco-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eco-blue text-xs font-body"
                  />
                </div>

                <div>
                  <label className="block text-eco-muted-light uppercase tracking-wider mb-2">Promotional Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'instagram', label: 'Instagram' },
                      { id: 'email', label: 'Email Blast' },
                      { id: 'flyer', label: 'Flyer/Poster' },
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setChannel(ch.id as any)}
                        className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                          channel === ch.id 
                            ? 'bg-eco-blue/20 border-eco-blue text-white font-bold'
                            : 'bg-eco-black border-white/10 text-eco-muted-light hover:text-white'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formula Skeleton Reminder */}
              <div className="p-4 rounded-xl bg-eco-black/60 border border-white/5 space-y-2 text-xs">
                <span className="font-heading font-bold text-eco-orange uppercase tracking-wider block">The 5-Beat Formula Used:</span>
                <p className="text-eco-muted-light font-mono text-[11px]">Hook → Outcome → Mechanism → Proof → CTA</p>
              </div>
            </div>

            {/* Generated Copy Output */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-eco-surface p-6 md:p-8 rounded-2xl border border-eco-blue/30 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-eco-blue tracking-widest font-bold flex items-center gap-2">
                    <CheckCircle size={14} /> Ready-To-Publish Output ({channel.toUpperCase()})
                  </span>
                  <button
                    onClick={() => handleCopy(generateCopy())}
                    className="btn-glow !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Copy'}
                  </button>
                </div>

                <pre className="whitespace-pre-wrap font-body text-sm text-eco-muted-light leading-relaxed bg-eco-black/90 p-5 rounded-xl border border-white/10 max-h-[500px] overflow-y-auto">
                  {generateCopy()}
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: 5-QUESTION COPY CHECKER */}
        {activeTab === 'checker' && (
          <motion.div
            key="checker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-eco-surface p-6 rounded-2xl border border-eco-border">
                <label className="block font-heading font-bold text-sm uppercase text-white mb-3">
                  Paste or Write Draft Marketing Copy Here:
                </label>
                <textarea
                  rows={8}
                  value={draftCopy}
                  onChange={(e) => setDraftCopy(e.target.value)}
                  className="w-full bg-eco-black border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-eco-blue font-body leading-relaxed"
                  placeholder="Paste your promotional caption or flyer text..."
                />
              </div>

              {/* Jargon Auto-Detector */}
              {flaggedJargon.length > 0 ? (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
                  <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-amber-400">
                    <AlertTriangle size={16} /> Jargon Detected! Replace with parent-friendly terms:
                  </div>
                  <div className="space-y-2">
                    {flaggedJargon.map(item => (
                      <div key={item.neverSay} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-eco-black/40 p-2.5 rounded-lg gap-1 border border-amber-500/20">
                        <span className="line-through text-red-300 font-mono">"{item.neverSay}"</span>
                        <span className="text-green-300 font-heading font-semibold">➡ "{item.sayInstead}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-heading font-semibold">
                  <CheckCircle size={16} /> Clean! No academic jargon detected in your draft.
                </div>
              )}
            </div>

            {/* Checklist Panel */}
            <div className="lg:col-span-5 bg-eco-surface p-6 rounded-2xl border border-eco-border space-y-6">
              <div>
                <h3 className="font-heading font-bold text-base text-white uppercase mb-1">
                  Five-Question Quality Gate
                </h3>
                <p className="text-xs text-eco-muted-light">
                  Every ad or post must satisfy all 5 questions before publishing.
                </p>
              </div>

              <div className="space-y-4">
                {FIVE_QUESTION_CHECKLIST.map((q) => (
                  <label 
                    key={q.id}
                    onClick={() => setCheckedItems(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      checkedItems[q.id] 
                        ? 'bg-eco-blue/15 border-eco-blue/40 text-white' 
                        : 'bg-eco-black/50 border-white/5 text-eco-muted'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={!!checkedItems[q.id]}
                      onChange={() => {}}
                      className="mt-0.5 accent-eco-blue rounded"
                    />
                    <div>
                      <span className="font-heading font-bold text-xs block">{q.id}. {q.question}</span>
                      <span className="text-[11px] text-eco-muted-light block font-body mt-0.5">{q.description}</span>
                    </div>
                  </label>
                ))}
              </div>

              {Object.values(checkedItems).filter(Boolean).length === 5 ? (
                <div className="p-3 text-center bg-eco-blue/20 border border-eco-blue/40 rounded-xl text-eco-blue text-xs font-heading font-bold uppercase tracking-wider">
                  🎉 Ready to Post! Pass 5/5
                </div>
              ) : (
                <div className="p-3 text-center bg-white/5 border border-white/10 rounded-xl text-eco-muted-light text-xs font-mono">
                  Progress: {Object.values(checkedItems).filter(Boolean).length}/5 Questions Answered
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: TRANSLATION DICTIONARY */}
        {activeTab === 'dictionary' && (
          <motion.div
            key="dictionary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-eco-surface p-4 rounded-2xl border border-eco-border">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted" />
                <input
                  type="text"
                  placeholder="Search terms or phrases..."
                  value={dictionarySearch}
                  onChange={(e) => setDictionarySearch(e.target.value)}
                  className="w-full bg-eco-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-eco-blue"
                />
              </div>
              <span className="text-xs text-eco-muted font-mono">
                Showing {filteredDictionary.length} of {TRANSLATION_DICTIONARY.length} terms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDictionary.map((item) => (
                <div key={item.neverSay} className="glow-card p-6 bg-eco-surface border border-eco-border rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-red-400 line-through bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        Never say: {item.neverSay}
                      </span>
                      <button
                        onClick={() => handleCopy(item.sayInstead)}
                        className="text-[11px] font-mono text-eco-blue hover:text-white flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy Phrase
                      </button>
                    </div>
                    <h3 className="font-heading font-bold text-base text-white mb-2 text-eco-blue-light">
                      Say instead: "{item.sayInstead}"
                    </h3>
                    <p className="text-xs text-eco-muted-light">
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: FULL PLAYBOOK DOCUMENT */}
        {activeTab === 'playbook' && (
          <motion.div
            key="playbook"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glow-card p-8 md:p-12 bg-eco-surface border border-eco-border space-y-10 text-sm leading-relaxed"
          >
            {/* Section 1 */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-eco-blue uppercase tracking-widest font-bold">1. What Parents Actually Buy</span>
              <h2 className="font-display text-2xl uppercase text-white">Sell the Transformation</h2>
              <p className="text-eco-muted-light">
                Parents don't buy basketball. They buy what it does for their kid: confidence, real improvement, better decisions on the court, more playing time, and a coach they trust. They wake up thinking:
              </p>
              <ul className="list-disc list-inside text-eco-muted-light space-y-1 pl-2 font-mono text-xs">
                <li>"My kid freezes during games."</li>
                <li>"My kid practices all the time and doesn't get better."</li>
                <li>"I want a coach who actually develops my child."</li>
                <li>"I don't want to waste another season."</li>
              </ul>
            </div>

            <hr className="border-white/10" />

            {/* Section 2 */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-eco-blue uppercase tracking-widest font-bold">2. Positioning Statement</span>
              <div className="p-6 rounded-xl bg-eco-black border border-eco-blue/30 text-white italic font-heading font-semibold">
                "{POSITIONING_STATEMENT}"
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Section 3 */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-eco-blue uppercase tracking-widest font-bold">3. Proof Rules</span>
              <h2 className="font-display text-xl uppercase text-white">The Hero is the Player</h2>
              <p className="text-eco-muted-light">
                Winning is not the promise. It's the evidence. Never lead with "we're the best because we won." Lead with the transformation, then use winning or metrics as evidence. The hero is always the player, never EcoHoops.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
