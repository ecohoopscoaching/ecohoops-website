import { motion } from 'framer-motion'
import { BookOpen, Printer, Download, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BernsteinGuide() {
  const handlePrint = () => {
    window.print()
  }

  const chapters = [
    { id: 'intro', title: 'Introduction: Movement as Music' },
    { id: 'ch1', title: 'Chapter 1: Forgetting the Myth of the Perfect Shot' },
    { id: 'ch2', title: 'Chapter 2: Bernstein’s “Repetition Without Repetition”' },
    { id: 'ch3', title: 'Chapter 3: Why Beginners Need Exploration' },
    { id: 'ch4', title: 'Chapter 4: The Constraints-Led Approach' },
    { id: 'ch5', title: 'Chapter 5: Equipment Matters' },
    { id: 'ch6', title: 'Chapter 6: Shooting from Deep' },
    { id: 'ch7', title: 'Chapter 7: Troubleshooting Technique' },
    { id: 'ch8', title: 'Chapter 8: Feedback Guidelines' },
    { id: 'ch9', title: 'Chapter 9: Building Shooting Workouts' },
    { id: 'bonus', title: 'Bonus Chapter: Shooting Lies to Unlearn' },
    { id: 'checklist', title: 'Parent’s Role Checklist' },
    { id: 'sheet', title: 'Printable Weekly Shooting Sheet' },
    { id: 'conclusion', title: 'Conclusion: Shooting as Art' }
  ]

  return (
    <div className="pt-28 pb-20 min-h-screen bg-eco-dark text-white print:bg-white print:text-black">
      {/* CSS style to format printing nicely */}
      <style>{`
        @media print {
          nav, footer, .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          h1, h2, h3, h4 {
            page-break-after: avoid;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 print-container">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 no-print">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-eco-muted-light hover:text-eco-blue transition-colors font-heading uppercase font-bold">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="btn-glow !py-2 !px-4 text-xs inline-flex items-center gap-2 border border-eco-blue/30"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <a 
              href="/Bernstein_Basketball_Guide.txt" 
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-eco-surface hover:bg-eco-surface2 border border-white/5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-eco-muted-light hover:text-white transition-all"
            >
              <Download size={14} /> Download TXT
            </a>
          </div>
        </div>

        {/* Ebook Header cover */}
        <div className="text-center py-12 md:py-20 border-b border-white/5 mb-12 print:border-black/10">
          <span className="font-mono text-xs uppercase tracking-widest text-eco-blue mb-4 block no-print">Exclusive Bonus Gift</span>
          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-wider leading-tight mb-3">
            THE BERNSTEIN
            <br />
            <span className="gradient-text print:text-black">BASKETBALL GUIDE</span>
          </h1>
          <h2 className="font-heading font-bold text-lg md:text-2xl text-[#97B3D2] uppercase tracking-wide mb-8 print:text-black">
            How to Help Your Kid Shoot from Anywhere (Especially from Deep)
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-eco-muted-light">
            By Adrian Sapp | EcoHoops – Kids First, Always
          </p>
        </div>

        {/* Table of Contents */}
        <div className="glow-card p-6 md:p-8 bg-eco-surface/40 border border-eco-border rounded-2xl mb-12 no-print">
          <h3 className="font-heading font-bold text-base uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-eco-blue" /> Table of Contents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-heading">
            {chapters.map((ch, idx) => (
              <a 
                key={ch.id} 
                href={`#${ch.id}`} 
                className="py-1.5 px-3 rounded-lg hover:bg-eco-blue/10 hover:text-white text-eco-muted-light flex items-center justify-between group transition-all"
              >
                <span>{idx + 1}. {ch.title}</span>
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-eco-blue" />
              </a>
            ))}
          </div>
        </div>

        {/* Ebook Content Area */}
        <div className="prose prose-invert max-w-2xl mx-auto prose-p:text-white/90 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-li:text-white/90 prose-li:text-base md:prose-li:text-lg prose-h1:font-display prose-h1:tracking-wider prose-h1:uppercase prose-h2:font-display prose-h2:tracking-wider prose-h2:uppercase prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h3:font-heading prose-h3:font-bold prose-h3:tracking-wide prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:font-heading prose-h4:font-bold prose-h4:tracking-wide prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 print:prose-black">
          
          {/* Introduction */}
          <section id="intro" className="scroll-mt-28">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Introduction</span>
            <h2>Movement as Music</h2>
            <p>
              Learning basketball is like learning music.
            </p>
            <p>
              You don’t start by playing Mozart perfectly from a score. You begin by exploring sounds, rhythms, and melodies. You make mistakes. You experiment. You slowly discover what works.
            </p>
            <p>
              Shooting a basketball works the same way.
            </p>
            <p>
              A basketball shot is not something a kid memorizes like a robot. It is something they discover through movement, rhythm, timing, balance, and adaptation.
            </p>
            <p>
              Russian scientist and motor learning pioneer Nikolai Bernstein called this idea:
            </p>
            <div className="glow-card p-6 border-l-4 border-eco-blue bg-eco-surface/50 rounded-r-2xl my-6 print:border-black">
              <h4 className="font-heading font-bold text-lg uppercase tracking-wide text-white print:text-black mb-1">“Repetition Without Repetition”</h4>
              <p className="text-sm md:text-base text-white/90 print:text-black mb-0">
                That means even when a player is doing “the same shot,” the movement is never exactly identical.
              </p>
            </div>
            <p>
              Every shot changes slightly:
            </p>
            <ul>
              <li>Different balance</li>
              <li>Different timing</li>
              <li>Different speed</li>
              <li>Different fatigue</li>
              <li>Different distance</li>
              <li>Different pressure</li>
            </ul>
            <p>
              Real skill is not repeating the exact same movement forever. Real skill is adapting.
            </p>
            <p>
              This guide will help you understand:
            </p>
            <ul>
              <li>Why kids need exploration</li>
              <li>Why forcing “perfect form” can hurt development</li>
              <li>How to use constraints instead of constant correction</li>
              <li>How to help kids shoot from deep naturally</li>
              <li>How to build adaptable shooters instead of robotic ones</li>
            </ul>
            <p>
              Think of this guide as a music lesson. The ball, rim, and court are instruments. Your child is the musician. Your job is not to control every note. Your job is to help them discover rhythm.
            </p>
          </section>

          {/* Chapter 1 */}
          <section id="ch1" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 1</span>
            <h2>Forgetting the Myth of the Perfect Shot</h2>
            <p>
              Imagine planting a garden. You don’t scream at flowers to grow perfectly straight. You don’t yank them upward to make them taller faster.
            </p>
            <p>
              You give them:
            </p>
            <ul>
              <li>Sunlight</li>
              <li>Water</li>
              <li>Soil</li>
              <li>Space</li>
            </ul>
            <p>
              Then nature takes over. Shooting development works the same way.
            </p>
            <p>
              Too many adults panic the second a kid’s shot looks awkward. They see a low arc, two hands, weird footwork, a side release, or a thumb flick. Then immediately: <em>“NO NO NO THAT’S WRONG.”</em>
            </p>
            <p>
              But Bernstein’s research showed something important: <strong>Human movement is naturally variable.</strong>
            </p>
            <p>
              There is no universal perfect shot. Different players solve movement problems differently. That’s why Steph Curry shoots differently than Klay Thompson, Tyrese Haliburton shoots differently than Devin Booker, and Reggie Miller shot differently than Ray Allen.
            </p>
            <p>
              Top shooters are not copy-paste robots. They are adaptable movement problem-solvers.
            </p>
            <p>
              The goal is not: <strong>“Can your child copy a textbook?”</strong>
            </p>
            <p>
              The real question is: <strong>“Can your child adapt and make shots in real environments?”</strong> That changes everything.
            </p>
          </section>

          {/* Chapter 2 */}
          <section id="ch2" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 2</span>
            <h2>Bernstein’s “Repetition Without Repetition”</h2>
            <p>
              Nikolai Bernstein studied blacksmiths hammering metal. At first glance, every strike looked identical. But when he measured the movements carefully, he discovered something shocking: <strong>No two swings were exactly the same.</strong>
            </p>
            <p>
              Even experts constantly adjusted their angle, timing, force, and coordination. Their bodies adapted automatically.
            </p>
            <p>
              That’s what high-level skill actually is—not robotic sameness, but adaptive consistency.
            </p>

            <div className="bg-eco-surface2/60 p-5 rounded-xl border border-white/5 my-6 print:border-black">
              <h4 className="font-heading font-bold text-sm uppercase text-eco-blue mb-2">Try This at Home</h4>
              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-0">
                Write your signature 5 times. Now compare them. They are similar... but not identical. Your brain naturally adjusts every repetition. Basketball shooting works the same way. Every shot changes based on balance, rhythm, defender position, fatigue, distance, and speed.
              </p>
            </div>

            <h3>Words to Know</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Variability:</strong> Small changes in how you move each time.
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Adaptation:</strong> Changing how you move to fit the game.
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Coordination:</strong> How your body parts work together to solve movement problems.
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Self-Organization:</strong> The body naturally finding movement solutions without someone telling you what to do.
              </div>
            </div>
          </section>

          {/* Chapter 3 */}
          <section id="ch3" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 3</span>
            <h2>Why Beginners Need Exploration, Not Correction</h2>
            <p>
              Imagine trying to learn language by memorizing the dictionary. Sounds ridiculous, right?
            </p>
            <p>
              But that’s how many coaches teach shooting. They stop kids constantly: <em>“Elbow in.” “Feet straight.” “Hold your follow-through.” “Jump higher.” “Don’t move.”</em>
            </p>
            <p>
              The kid becomes scared to experiment, scared to fail, and scared to move naturally.
            </p>
            <p>
              But real learning comes from exploration. Kids need freedom, curiosity, trial and error, and movement variety.
            </p>
            <p>
              Think about how babies learn to walk. Nobody gives them a 45-minute lecture about hip angles. They explore, fall, adjust, and adapt. That’s how shooting should work too.
            </p>

            <h3>Words to Know</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Exploration:</strong> Trying different ways to move and solve a problem.
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Constraints:</strong> Rules or game setups that shape how you move.
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Affordances:</strong> Choices the court gives you (like an open space that lets you run).
              </div>
            </div>
          </section>

          {/* Chapter 4 */}
          <section id="ch4" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 4</span>
            <h2>Building the Ultimate Shooting Garden</h2>
            <h3 className="text-eco-blue">The Constraints-Led Approach (CLA)</h3>
            <p>
              Instead of telling kids what to do, change the game setup. Let the game teach them.
            </p>
            <p>
              Smart game setups help kids learn to move naturally. They find their own solutions. This helps them:
            </p>
            <ul>
              <li>Remember what they learned</li>
              <li>Adapt to different games</li>
              <li>Play better in real games</li>
            </ul>

            <h3>Examples of Constraints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-white/90">
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Mini Basketballs</h4>
                <p className="text-white/80 mb-0">Encourage wrist action and a cleaner release.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Lower Rims</h4>
                <p className="text-white/80 mb-0">Help kids shoot naturally without heaving.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">One-Hand Shooting</h4>
                <p className="text-white/80 mb-0">Reduces guide-hand interference.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Time Limits</h4>
                <p className="text-white/80 mb-0">Teach rhythm and quick decision-making.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Movement Shots</h4>
                <p className="text-white/80 mb-0">Shooting after cuts improves game realism.</p>
              </div>
            </div>
          </section>

          {/* Chapter 5 */}
          <section id="ch5" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 5</span>
            <h2>Rim Height and Ball Size Matter</h2>
            <p>
              One of the biggest mistakes in youth basketball: <strong>wrong equipment</strong>.
            </p>
            <p>
              A 7-year-old shooting on a 10-foot rim with a heavy ball is like giving a child an adult-sized guitar. They compensate. That creates chest shots, two-hand pushes, poor sequencing, and weird mechanics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-5 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase text-sm mb-3">Recommended Rim Heights</h4>
                <ul className="space-y-1.5 text-sm text-white/90">
                  <li><strong>Ages 5–8:</strong> 8-foot rims</li>
                  <li><strong>Ages 9–10:</strong> 9-foot rims</li>
                  <li><strong>Ages 11+:</strong> 10-foot rims (if capable)</li>
                </ul>
              </div>
              <div className="p-5 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase text-sm mb-3">Recommended Ball Sizes</h4>
                <ul className="space-y-1.5 text-sm text-white/90">
                  <li><strong>Ages 5–8:</strong> Size 5 (27.5")</li>
                  <li><strong>Ages 9–12:</strong> Size 6 (28.5")</li>
                  <li><strong>Ages 13+:</strong> Size 7 (29.5")</li>
                </ul>
              </div>
            </div>
            <p className="text-sm md:text-base font-semibold text-eco-blue">
              Important Truth: Bad equipment creates bad movement solutions. Good constraints create good movement solutions.
            </p>
          </section>

          {/* Chapter 6 */}
          <section id="ch6" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 6</span>
            <h2>Shooting from Deep</h2>
            <h3 className="text-eco-blue">The Magic of 3-Point Mastery</h3>
            <p>
              The game changed. The 3-point shot is no longer optional. But many adults teach range completely wrong. They think: <em>“Shoot harder.”</em> Wrong.
            </p>
            <p>
              Deep shooting is mostly about <strong>sequencing, timing, rhythm, flow, and energy transfer</strong>. Not brute force.
            </p>

            <div className="glow-card p-6 border-l-4 border-eco-blue bg-eco-surface/50 rounded-r-2xl my-6">
              <h4 className="font-heading font-bold text-lg uppercase tracking-wide text-white mb-1">The Sailing Analogy</h4>
              <p className="text-sm md:text-base text-white/90 mb-0">
                Shooting from deep is like sailing across the ocean. You cannot control the wind, waves, or storms. You learn to adapt to them. Shooters must adapt too.
              </p>
            </div>

            <h3>Deep Shooting Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90">
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h5 className="font-heading font-bold text-white uppercase mb-1">Distance Voyages</h5>
                <p className="text-white/80 mb-0">Slowly move backward over time as rhythm develops.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h5 className="font-heading font-bold text-white uppercase mb-1">Storm Drills</h5>
                <p className="text-white/80 mb-0">Add pressure: timers, defenders, quick catches, and movement.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h5 className="font-heading font-bold text-white uppercase mb-1">Anchor Drills</h5>
                <p className="text-white/80 mb-0">Sprint &rarr; stop suddenly &rarr; shoot. Teaches balance and core control.</p>
              </div>
            </div>

            <h3>Words to Know</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90 mt-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Sequencing:</strong> How body parts move in a smooth order (like legs then arms).
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Rhythm:</strong> The smooth timing of your movement.
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <strong>Transfer:</strong> When skills learned in practice work in a real game.
              </div>
            </div>
          </section>

          {/* Chapter 7 */}
          <section id="ch7" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 7</span>
            <h2>Troubleshooting “Bad Technique”</h2>
            <p>
              Adults see everything as a problem. That’s the <strong>“Fix-It Reflex.”</strong>
            </p>
            <p>
              But not every unusual movement needs correction. Sometimes kids are simply adapting. Stop trying to fix every tiny movement. Guide the environment instead.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border flex gap-4">
                <div className="font-heading font-bold text-xl text-eco-blue">01</div>
                <div>
                  <h4 className="font-heading font-bold text-white text-xs uppercase">“Their elbow isn’t tucked.”</h4>
                  <p className="text-sm md:text-base text-white/90 mt-1 mb-0">Truth: Bodies are different. Focus on function, not geometric angles.</p>
                </div>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border flex gap-4">
                <div className="font-heading font-bold text-xl text-eco-blue">02</div>
                <div>
                  <h4 className="font-heading font-bold text-white text-xs uppercase">“They use two hands.”</h4>
                  <p className="text-sm md:text-base text-white/90 mt-1 mb-0">Try: Smaller balls, lower rims, and one-hand shooting games rather than lecturing.</p>
                </div>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border flex gap-4">
                <div className="font-heading font-bold text-xl text-eco-blue">03</div>
                <div>
                  <h4 className="font-heading font-bold text-white text-xs uppercase">“Their arc is too flat.”</h4>
                  <p className="text-sm md:text-base text-white/90 mt-1 mb-0">Try: Rainbow contests—who can shoot with the highest arc over an obstacle?</p>
                </div>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border flex gap-4">
                <div className="font-heading font-bold text-xl text-eco-blue">04</div>
                <div>
                  <h4 className="font-heading font-bold text-white text-xs uppercase">“Their feet aren’t square.”</h4>
                  <p className="text-sm md:text-base text-white/90 mt-1 mb-0">Truth: Most top shooters are slightly turned. Squaring up can stress the neck and shoulder.</p>
                </div>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border flex gap-4">
                <div className="font-heading font-bold text-xl text-eco-blue">05</div>
                <div>
                  <h4 className="font-heading font-bold text-white text-xs uppercase">“They don’t use their legs.”</h4>
                  <p className="text-sm md:text-base text-white/90 mt-1 mb-0">Instead of yelling "USE YOUR LEGS!", create distance challenges that naturally force leg drive.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 8 */}
          <section id="ch8" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 8</span>
            <h2>Feedback</h2>
            <h3 className="text-eco-blue">The Fertilizer for Learning</h3>
            <p>
              Too much feedback kills learning. Kids cannot process 9 mechanics, 6 body parts, and 14 corrections at once. Great feedback is:
            </p>
            <ul>
              <li><strong>Immediate:</strong> Given in the moment, not 45 minutes later.</li>
              <li><strong>Simple:</strong> One idea at a time.</li>
              <li><strong>Action-Based:</strong> Actionable cues (e.g. <em>“Try shooting higher”</em> instead of <em>“Your kinetic chain sequencing is inefficient”</em>).</li>
            </ul>

            <div className="bg-eco-surface2/60 p-5 rounded-xl border border-white/5 my-6">
              <h4 className="font-heading font-bold text-sm uppercase text-eco-blue mb-2">Better Questions to Ask</h4>
              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-0">
                Instead of asking <em>“Why did you miss?”</em>, prompt them to self-evaluate:
                <br />
                • <em>“What did you notice about that shot?”</em>
                <br />
                • <em>“What felt different when you hit the rim?”</em>
                <br />
                • <em>“What adjustment helped you make the last one?”</em>
              </p>
            </div>
          </section>

          {/* Chapter 9 */}
          <section id="ch9" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Chapter 9</span>
            <h2>Building Shooting Workouts</h2>
            <p>
              Keep workouts simple. The Bernstein Shooting Formula is built around progress through exploration and game-like constraints:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-semibold text-white text-sm">1. Warm-Up (5 mins)</h4>
                <p className="text-sm text-white/90 mt-1 mb-0">Easy shooting from multiple spots. No pressure, just getting a feel for the ball.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-semibold text-white text-sm">2. Exploration (5 mins)</h4>
                <p className="text-sm text-white/90 mt-1 mb-0">Try weird shots: different arcs, different footwork, different tempos, off-balance gathers.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-semibold text-white text-sm">3. Constraints (10 mins)</h4>
                <p className="text-sm text-white/90 mt-1 mb-0">Use mini balls, one-hand shooting, lower rims, or weird passing angles.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-semibold text-white text-sm">4. Game-Like Shooting (10 mins)</h4>
                <p className="text-sm text-white/90 mt-1 mb-0">Add movement, timers, defenders, quick catches, or decision-making triggers.</p>
              </div>
            </div>
          </section>

          {/* Bonus Chapter */}
          <section id="bonus" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Bonus Chapter</span>
            <h2>Shooting Lies to Unlearn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/90">
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Lie #1: “Perfect Form First”</h4>
                <p className="text-white/80 mb-0">Function comes first. Adaptable shooters survive; textbook robots freeze.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Lie #2: “10,000 Perfect Reps”</h4>
                <p className="text-white/80 mb-0">Robotic reps don't translate to a chaotic game with active defenders.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Lie #3: “Deep Range Needs Strength”</h4>
                <p className="text-white/80 mb-0">Shooting from deep is about fluid sequencing, rhythm, and energy flow.</p>
              </div>
              <div className="p-4 bg-eco-surface rounded-xl border border-eco-border">
                <h4 className="font-heading font-bold text-white uppercase mb-1">Lie #4: “Freeze Your Follow-Through”</h4>
                <p className="text-white/80 mb-0">It is a useful tool for awareness, not a magic physics law.</p>
              </div>
            </div>
          </section>

          {/* Parent Checklist */}
          <section id="checklist" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Checklist</span>
            <h2>Parent’s Role Checklist</h2>
            <p>
              Your child does not need a second coach on the drive home, constant sideline criticism, or a post-game interrogation. They need support.
            </p>
            <div className="glow-card p-6 bg-eco-surface/50 border border-eco-border rounded-2xl">
              <ul className="space-y-3 text-sm md:text-base text-white/90 mb-0">
                <li className="flex gap-2"><CheckCircle className="text-eco-blue flex-shrink-0" size={14} /> Cheer for effort and creative tries rather than makes or wins.</li>
                <li className="flex gap-2"><CheckCircle className="text-eco-blue flex-shrink-0" size={14} /> Let them experiment and play streetball without correcting them.</li>
                <li className="flex gap-2"><CheckCircle className="text-eco-blue flex-shrink-0" size={14} /> Ask simple questions like "Did you have fun?" or "What felt good today?".</li>
                <li className="flex gap-2"><CheckCircle className="text-eco-blue flex-shrink-0" size={14} /> Trust the natural developmental process and stop obsessing over mechanics.</li>
              </ul>
            </div>
          </section>

          {/* Weekly Shooting Sheet */}
          <section id="sheet" className="scroll-mt-28 page-break">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Weekly Tracker</span>
            <h2>Printable Weekly Shooting Sheet</h2>
            <div className="border border-white/10 rounded-2xl p-6 bg-eco-surface/30 print:border-black">
              <div className="flex flex-col sm:flex-row justify-between border-b border-white/5 pb-4 mb-4 gap-4 print:border-black">
                <div>
                  <span className="text-xs font-mono uppercase text-white/70">Player Name:</span>
                  <div className="h-6 w-48 border-b border-white/10 mt-1 print:border-black"></div>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-white/70">Week Of:</span>
                  <div className="h-6 w-32 border-b border-white/10 mt-1 print:border-black"></div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-heading font-semibold uppercase text-eco-blue print:text-black mb-1">Daily Workout Track</h4>
                  <p className="text-xs text-white/70">Write down what you tried today (Warm-up, spots, etc.):</p>
                  <div className="h-10 border-b border-white/5 mt-1 print:border-black"></div>
                </div>

                <div>
                  <h4 className="font-heading font-semibold uppercase text-eco-blue print:text-black mb-1">Exploration Challenge</h4>
                  <p className="text-xs text-white/70">What weird or new shot did you try? (Different arc, off-balance, etc.):</p>
                  <div className="h-10 border-b border-white/5 mt-1 print:border-black"></div>
                </div>

                <div>
                  <h4 className="font-heading font-semibold uppercase text-eco-blue print:text-black mb-1">Constraints Used</h4>
                  <div className="flex flex-wrap gap-4 mt-2 mb-2 text-xs text-white/80">
                    <span className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-eco-dark border-white/10" /> Mini Ball</span>
                    <span className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-eco-dark border-white/10" /> Lower Rim</span>
                    <span className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-eco-dark border-white/10" /> One-Hand Shot</span>
                    <span className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-eco-dark border-white/10" /> Quick Release</span>
                    <span className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-eco-dark border-white/10" /> Movement Shot</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4 print:border-black">
                  <div>
                    <h5 className="font-heading font-bold text-white text-xs uppercase mb-1">Weekly Reflection</h5>
                    <p className="text-xs text-white/70">Favorite shot this week:</p>
                    <div className="h-8 border-b border-white/5 print:border-black"></div>
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-white text-xs uppercase mb-1">Goal for Next Week</h5>
                    <p className="text-xs text-white/70">What do you want to explore next?</p>
                    <div className="h-8 border-b border-white/5 print:border-black"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section id="conclusion" className="scroll-mt-28 page-break pb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-eco-blue block mb-2">Conclusion</span>
            <h2>Conclusion: Shooting as Art, Not Science</h2>
            <p>
              Your child’s shot is not a machine. It is a living movement solution—always changing, always adapting.
            </p>
            <p>
              Your job is not to force perfection. Your job is to create joy, exploration, freedom, challenge, and confidence.
            </p>
            <p className="font-heading font-semibold text-white print:text-black">
              Be the gardener. Not the sculptor. Let movement grow naturally. Let the game teach. Let the child adapt.
            </p>
            <p>
              Now grab a ball, head outside, and start planting.
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}
