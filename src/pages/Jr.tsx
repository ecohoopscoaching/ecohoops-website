import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { 
  Heart, Users, CheckCircle, Sparkles, Move, Target, Shield, Play, Smile, ChevronRight, ChevronLeft, BookOpen, Brain, X
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Jr() {
  useDocumentTitle('EcoHoops Jr. (Ages 4-11)')
  const { ref, isVisible } = useScrollReveal(0.05)
  const [activeCohort, setActiveCohort] = useState<'minis' | 'rookies' | 'hoopers'>('minis')
  const [psychologySlide, setPsychologySlide] = useState(0)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [parentEmail, setParentEmail] = useState('')
  const [practicePlanStatus, setPracticePlanStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [showDrillsModal, setShowDrillsModal] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [exitIntentDismissed, setExitIntentDismissed] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 5 && !showExitIntent && !exitIntentDismissed && practicePlanStatus !== 'success') {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [showExitIntent, exitIntentDismissed, practicePlanStatus])

  const handlePracticePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!parentEmail) return
    setPracticePlanStatus('submitting')
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "933bf5e4-2815-45e1-853f-a58c9fb77a2f",
          subject: "New EcoHoops Backyard Practice Plan Request!",
          Email: parentEmail,
          from_name: "EcoHoops Website",
        }),
      });
      const result = await response.json();
      if (result.success) {
        setPracticePlanStatus('success')
        setShowExitIntent(false)
        setShowDrillsModal(true)
      } else {
        setPracticePlanStatus('error')
        setTimeout(() => setPracticePlanStatus('idle'), 3000)
      }
    } catch (error) {
      setPracticePlanStatus('error')
      setTimeout(() => setPracticePlanStatus('idle'), 3000)
    }
  }

  const handleDownloadDrills = () => {
    const drillsText = `ECOHOOPS JR. EASY PLAY-AND-LEARN SHOOTING PLAN
5 fun shooting games to help your brain learn fast!

We use a special method called **Differential Learning** (which means **learning by doing things differently each time**). By changing how you stand, move, and look, your brain finds the best way to shoot. We call these changes **Variability** (which just means **mixing things up**).

1. Changing Your Feet (Footing Variability)
Shoot 10 times, but stand differently on every shot. Try these: (a) feet pressed tight together, (b) feet spread super wide like a sumo wrestler, (c) left foot forward and right foot back, (d) right foot forward and left foot back, and (e) stand on only one foot.
Why it helps: This makes your body find its balance and power when standing in weird ways. It makes your normal shot much stronger.

2. High and Low Shots (Release Point Variability)
Shoot 10 times, but change how high and how you throw the ball: (a) shoot a super high rainbow shot, (b) shoot a very flat shot, (c) throw the ball from your forehead, (d) throw it from your chest, and (e) push it with only one hand.
Why it helps: This helps your brain learn the best way to release the ball by trying different heights.

3. Changing Your Body Shape (Posture Variability)
Change how your body looks when you let go of the ball: (a) shoot from a deep crouch (knees bent deep), (b) shoot with legs completely straight and stiff, (c) lean a little bit to the left, (d) lean a little bit to the right, and (e) shrug your shoulders high.
Why it helps: This teaches your arms to adjust and make the basket even if your body is off balance.

4. Quick Moves Before the Shot (Movement Variability)
Toss the ball to yourself. Do one of these moves quickly before you catch and shoot: (a) do a jumping jack, catch, and shoot; (b) touch the floor, catch, and shoot; (c) roll your head in a circle, catch, and shoot; (d) hop backward, catch, and shoot; (e) lift one knee high, catch, and shoot.
Why it helps: This adds a bit of action right before you shoot. It teaches your nerves to steady themselves quickly.

5. Blind Spots (Visual Variability)
Change how you look at the hoop: (a) aim, close both eyes, and shoot; (b) close only one eye; (c) blink your eyes super fast while shooting; (d) start with your back to the hoop, spin around to find it, and shoot right away.
Why it helps: This stops you from just staring. It trains your **proprioception** (which is **your body's inner sense of where it is and how it is moving**).

Visit EcoHoops Jr. at http://localhost:3000/jr for more resources.`;

    const blob = new Blob([drillsText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EcoHoops_Jr_Differential_Shooting_Challenges.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const psychologySlides = [
    {
      title: "Train the Brain, Not Just the Feet",
      subtitle: "Most coaches only teach the body. They forget the mind. We do the opposite. A child who is scared of their coach cannot learn. It is that simple.",
      quote: "If you do not know how kids grow, you should not be coaching them.",
      tag: "The Start",
      points: [
        "Every word a coach says can build a child up or tear them down.",
        "Coaching is mostly about understanding kids. The basketball part is easy. We care about the child first."
      ]
    },
    {
      title: "1. Kids Are Not Mini Adults",
      subtitle: "Do not expect a 7-year-old to take hard comments or handle heavy pressure like a pro. That is bad for their growth.",
      quote: "A crying fit in the gym is not bad behavior. It is just a young brain still growing.",
      tag: "Brain Growth",
      points: [
        "A child's brain is still developing. We cannot expect them to control their feelings like adults.",
        "We teach kids where they are today, not where we want them to be."
      ]
    },
    {
      title: "2. Play is How We Learn",
      subtitle: "Play is not a break from learning. Play IS the learning.",
      quote: "Plastic orange cones do not play defense. Real games do.",
      tag: "Learning Engine",
      points: [
        "Fun games teach kids how to read the court, look at space, and be creative.",
        "Joy is not a reward. If kids do not have fun, their brains lock up and stop learning."
      ]
    },
    {
      title: "3. Keep the Spark Alive",
      subtitle: "Kids love to play and explore. But adults often ruin the fun by focusing only on trophies.",
      quote: "If a kid wants to quit, it is usually because an adult made the game feel like a job.",
      tag: "The Spark",
      points: [
        "Kids do well when they have choices, feel themselves getting better, and feel they belong.",
        "Scores, yelling parents, and constant criticism put out the fire inside."
      ]
    },
    {
      title: "4. Confidence is a Safe House",
      subtitle: "A child's belief in themselves is easy to break. It takes years to build, but only one yelling coach to ruin.",
      quote: "Who a child is matters way more than winning a basketball game.",
      tag: "Self-Belief",
      points: [
        "We never sit a child on the bench for making a mistake. Mistakes are just brave tries.",
        "Our gym is a safe place. Kids can try new things without being afraid of making mistakes."
      ]
    },
    {
      title: "5. Sports Should Help, Not Hurt",
      subtitle: "Most sports stress starts in high-pressure leagues. We are here to change that.",
      quote: "A coach's words become the child's inner voice. We make sure that voice is kind.",
      tag: "Mental Health",
      points: [
        "Tough love coaching creates fear and self-doubt that stays with a child for life.",
        "A kind coach builds a safe space that helps kids grow happy and strong in all parts of life."
      ]
    },
    {
      title: "The Simple Truth",
      subtitle: "If you want a robot, find a drill sergeant. If you want a creative, happy child, trust the science.",
      quote: "Less talking. More playing. No shaming. This is how we change the game.",
      tag: "Our Promise",
      points: [
        "We build the person first, the athlete second, and the basketball player third.",
        "Our junior program is built on science, respect, and a deep love for kids."
      ]
    }
  ]

  const cohorts = {
    minis: {
      title: "Mini Movers (Ages 5-6)",
      desc: "Every child gets their own ball. No standing in lines, and no long speeches. We use fun tag games, balance games, and simple challenges to teach running, stopping, and looking around. Kids leave sweating, smiling, and asking to come back.",
      focus: "Basic movement, balance, and having fun on the court."
    },
    rookies: {
      title: "Rookie Ballers (Ages 7-8)",
      desc: "We use a simple 2v2 game (two kids against two kids) on a small court. It feels like playing in the backyard. Every kid gets to pass, shoot, and defend. Everyone is active, and they learn very fast.",
      focus: "Dribbling under pressure, finding open space, and solving game problems."
    },
    hoopers: {
      title: "Junior Hoopers (Ages 9-10)",
      desc: "We move up to 3v3 games (three kids against three kids) on small courts. This is the best way for kids to grow. They touch the ball three times more than in a big 5v5 game. They learn to read the court and work together without boring, robotic plays.",
      focus: "Reading the court fast, spacing out, and shooting many times."
    }
  }



  return (
    <section ref={ref} className="pt-28 pb-20 min-h-screen bg-eco-dark text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#003366]/50 border border-[#97B3D2]/30 text-[#97B3D2] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-[#97B3D2]" />
            Jr. NBA / Jr. WNBA Coming to EcoHoops Jr.
          </div>
          <h1 className="font-display text-hero uppercase tracking-tighter mb-4 text-white leading-none">
            ECOHOOPS <span className="gradient-text">JUNIOR</span>
          </h1>
          <p className="text-eco-blue font-heading font-semibold text-lg max-w-3xl mx-auto tracking-wide">
            Imagine buying your 6-year-old a new video game, and the first level is an impossible boss fight with ten adults screaming instructions from the couch. They’d throw the controller down. Yet that's exactly how we teach kids basketball. We’re changing that.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/#jr-nba-waitlist"
              className="btn-glow inline-flex items-center gap-2 text-sm !py-2.5 !px-6"
            >
              <Sparkles size={16} />
              Join the Jr. NBA / Jr. WNBA Waitlist
            </a>
          </div>
        </motion.div>

        {/* 1. What EcoHoops Jr is About */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="tag text-xs bg-eco-blue/10 border-eco-blue/20 text-eco-blue uppercase tracking-widest font-mono">The Reality Check</span>
            <h2 className="font-display text-3xl uppercase tracking-wide text-white leading-tight">
              The Silent Tragedy of Youth Sports (And How We Fix It)
            </h2>
            <p className="text-eco-muted-light text-base leading-relaxed">
              Standard youth sports feel like a second job. They are rigid, serious, and obsessively focused on winning plastic trophies. That is why{' '}
              <a
                href="https://publications.aap.org/pediatrics/article/153/2/e2023065129/196435/Overuse-Injuries-Overtraining-and-Burnout-in-Young?autologincheck=redirected"
                target="_blank"
                rel="noopener noreferrer"
                className="text-eco-blue-light underline underline-offset-2 hover:text-white transition-colors font-semibold"
              >
                70% of kids quit sports by age 13
              </a>
              . They get burnt out. They get stressed. They stop having fun.
            </p>
            <p className="text-eco-muted-light text-base leading-relaxed">
              We stole a better blueprint from Belgian soccer genius Kris Van Der Haegen. In 2009, Belgium soccer was ranked #66 in the world. They banned scoreboards for little kids, threw out large team games, and moved to 2v2 play. Parents cried, screaming that soccer is a team sport. Six years later? Belgium was ranked #1 in the entire world. Why? Because you cannot learn a language by reading flashcards, and you cannot learn basketball if you never touch the ball. We prioritize active, small-sided play so your child builds real, dynamic skills.
            </p>
            <div className="glow-card p-6 border-l-4 border-eco-blue bg-eco-surface/50 rounded-r-2xl">
              <p className="text-white text-md italic font-heading font-medium leading-relaxed">
                "You cannot develop if you do not touch the ball. If that was the case, you should be able to become a pro athlete just by playing PlayStation!"
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-center">
            <h3 className="font-heading font-bold text-white text-lg mb-6 flex items-center gap-2">
              <Smile className="text-eco-blue" size={20} />
              Our Side of the Deal
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light">Zero lines. Waiting in line is for Tim Hortons, not our court. Constant action.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light">Child-sized eyes. Lighter balls and lower hoops so they build mechanics, not survival habits.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light">A psychological sanctuary. A welcoming gym where mistakes are celebrated as brave tries.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-eco-muted-light">Guaranteed ball touches. They will play, make decisions, and know they belong.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. What We Do */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="tag mb-3 inline-block">How We Train</span>
            <h2 className="font-display text-3xl uppercase tracking-wide text-white">Why Our Gym Feels Like a Video Game</h2>
            <p className="text-eco-muted-light text-sm max-w-xl mx-auto mt-2">
              We threw out the cones and the clipboards. Cones don't play defense. Here is how we build real players.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4">
                  <Play className="text-eco-blue" size={20} />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">Messy, Active Play</h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  We teach the game through play. Tag games, obstacle courses, and small-sided matches. Instead of practicing drills in a straight line, kids learn to handle the ball in changing, unpredictable environments. That's how real game intelligence is born.
                </p>
              </div>
            </div>

            <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4">
                  <Move className="text-eco-blue" size={20} />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">The Movement Language</h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  Basketball is a movement language. Before your kid can hit a crossover, their body needs to know how to sprint, stop, jump, land, and balance. We build dynamic athletic coordination first, protecting them from early injuries.
                </p>
              </div>
            </div>

            <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4">
                  <Target className="text-eco-blue" size={20} />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase">Child-Sized Courts</h3>
                <p className="text-xs text-eco-muted-light leading-relaxed">
                  We adapt the space to the child, not the other way around. Lighter balls, smaller courts, and lower hoops. When the game fits their body, they experience success immediately and build proper shooting form from day one.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Sacred Code */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="tag mb-3 inline-block">The Non-Negotiables</span>
            <h2 className="font-display text-section uppercase tracking-wide text-white">
              OUR SACRED CODE
            </h2>
            <p className="text-eco-muted-light text-base max-w-xl mx-auto mt-2">
              Four laws we guard fiercely. Because a coach's ego should never cost a child their love for the game.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Kids Come First",
                desc: "If a coaching decision feeds an adult's ego but hurts a child's confidence, it's banned. Simple as that.",
                icon: Heart,
                color: "#B0C8E0"
              },
              {
                title: "Mistakes Are the Curriculum",
                desc: "If they aren't messing up, they aren't learning. We don't correct mistakes—we design games that force them to adapt.",
                icon: Sparkles,
                color: "#97B3D2"
              },
              {
                title: "Zero Shaming",
                desc: "No yelling. No public embarrassment. No running laps as punishment. We build people, not just players.",
                icon: Brain,
                color: "#6A9BC7"
              },
              {
                title: "Tim Hortons Law",
                desc: "Standing in line is for buying coffee. On our court, every kid has a ball, and everyone is moving. Maximum reps.",
                icon: Target,
                color: "#4A7FB5"
              }
            ].map((code) => (
              <div key={code.title} className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4 border border-eco-blue/20">
                    <code.icon size={20} style={{ color: code.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 uppercase tracking-wide">
                    {code.title}
                  </h3>
                  <p className="text-xs text-eco-muted-light leading-relaxed">
                    {code.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      {/* The ABCs of Movement Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <span className="tag mb-3 inline-block">Movement Literacy</span>
          <h2 className="font-display text-section uppercase tracking-wide text-white">
            BEFORE THE BASKETBALL, THE BODY
          </h2>
          <p className="text-eco-muted-light text-base max-w-3xl mx-auto mt-4 leading-relaxed text-balance">
            You wouldn't expect a toddler to read a novel before learning the alphabet. Basketball is no different. Before your child can drive to the hoop, their nervous system needs to master the basic movement alphabet: balance, deceleration, and spatial control.
          </p>
        </div>

        {/* Three Categories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4 border border-eco-blue/20">
              <Move className="text-eco-blue" size={20} />
            </div>
            <h3 className="font-heading font-bold text-md text-white mb-2 uppercase">Locomotor Skills</h3>
            <p className="text-xs text-eco-muted-light leading-relaxed mb-4">
              <strong>Moving the machine through space.</strong> We teach kids to run, stop, sprint, and skip dynamically so they can navigate chaotic game environments without colliding or losing balance.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Running', 'Sprinting', 'Hopping', 'Skipping', 'Shuffling', 'Jumping'].map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-eco-blue font-heading font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4 border border-eco-blue/20">
              <Shield className="text-eco-blue" size={20} />
            </div>
            <h3 className="font-heading font-bold text-md text-white mb-2 uppercase">Stability Skills</h3>
            <p className="text-xs text-eco-muted-light leading-relaxed mb-4">
              <strong>Controlling the machine.</strong> Decelerating, landing safely from jumps, and maintaining posture under contact. This acts as a biological armor that protects joints and prevents injuries.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Balance', 'Stopping', 'Landing', 'Twisting', 'Bracing', 'Posture Control'].map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-eco-blue font-heading font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="glow-card p-6 bg-eco-surface border border-eco-border rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-eco-blue/10 flex items-center justify-center mb-4 border border-eco-blue/20">
              <Target className="text-eco-blue" size={20} />
            </div>
            <h3 className="font-heading font-bold text-md text-white mb-2 uppercase">Manipulative Skills</h3>
            <p className="text-xs text-eco-muted-light leading-relaxed mb-4">
              <strong>Controlling external objects.</strong> Dribbling, catching, and passing. Before we teach them complex shooting, we develop their direct relationship with the ball.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Throwing', 'Catching', 'Dribbling', 'Striking', 'Kicking'].map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-eco-blue font-heading font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center bg-eco-surface/30 p-6 rounded-2xl border border-eco-border/40">
          <p className="text-xs text-eco-muted-light max-w-3xl mx-auto leading-relaxed">
            These are the <strong>Universal Movement Foundations</strong>—the athletic building blocks. Because before your child learns basketball... their nervous system must learn how to coordinate their body in space. That is the real foundation.
          </p>
        </div>
      </div>



      {/* 3. Why We Do It */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-5 glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl">
          <h3 className="font-heading font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Heart className="text-eco-blue" size={20} />
            The Three Psychological Needs
          </h3>
          <p className="text-xs text-eco-muted-light leading-relaxed mb-6">
            We don't coach to please parents on the sidelines. We coach to satisfy the three biological needs every child has to stay motivated and happy:
          </p>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-eco-blue font-bold">1. Autonomy (Choice)</h4>
              <p className="text-xs text-eco-muted-light mt-0.5">Kids pick their ball, choose their mini-game formats, and help set practice rules. When they have agency, their interest stays red-hot.</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-eco-blue font-bold">2. Competence (Success)</h4>
              <p className="text-xs text-eco-muted-light mt-0.5">We set challenges that are "pleasantly frustrating"—difficult enough to stretch them, but close enough to succeed. They feel themselves get better every week.</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-eco-blue font-bold">3. Relatedness (Connection)</h4>
              <p className="text-xs text-eco-muted-light mt-0.5">We design practices around high-fives, team challenges, and shared problem-solving. They feel like they are part of a tribe.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="tag text-xs bg-eco-blue/10 border-eco-blue/20 text-eco-blue uppercase tracking-widest font-mono">The Science of Play</span>
          <h2 className="font-display text-3xl uppercase tracking-wide text-white leading-tight">
            Why Traditional Drills Are a Lie
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={16} className="text-eco-blue" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white text-sm">Play is the Real Teacher</h3>
                <p className="text-xs text-eco-muted-light mt-1">
                  Kids don't need to be drilled; they need to explore. When you remove the fear of making mistakes, the brain enters a flow state. Joy isn't a luxury—it's the fuel that makes skills stick.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield size={16} className="text-eco-blue" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white text-sm">Language over Flashcards</h3>
                <p className="text-xs text-eco-muted-light mt-1">
                  You don't teach a baby to speak by correcting their grammar every time they babble. You let them talk. Basketball is a movement language. We let them babble with the ball until it clicks.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={16} className="text-eco-blue" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white text-sm">Biology over Birthdays</h3>
                <p className="text-xs text-eco-muted-light mt-1">
                  Grouping kids strictly by calendar year is a lazy system that leaves late-bloomers behind. We group kids dynamically by physical and social readiness, so everyone gets a fair shot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* 4. Our Groups (Cohorts) Selector */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <span className="tag mb-3 inline-block">The Right Fit</span>
            <h2 className="font-display text-3xl uppercase tracking-wide text-white">Our Age Groups</h2>
            <p className="text-eco-muted-light text-sm max-w-xl mx-auto mt-2">
              We group children into three bands to make sure they get the perfect level of challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left buttons list */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(Object.keys(cohorts) as Array<keyof typeof cohorts>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCohort(key)}
                  className={`w-full text-left py-3 px-5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between whitespace-nowrap lg:whitespace-normal ${
                    activeCohort === key
                      ? 'bg-eco-blue text-eco-black shadow-glow-sm scale-[1.02]'
                      : 'bg-eco-surface hover:bg-eco-surface2 border border-white/5 text-eco-muted-light'
                  }`}
                >
                  <span>{cohorts[key].title}</span>
                  <ChevronRight size={12} className="hidden lg:inline" />
                </button>
              ))}
            </div>

            {/* Right details panel */}
            <div className="lg:col-span-8 glow-card p-8 bg-eco-surface border border-eco-border rounded-2xl min-h-[200px] flex flex-col justify-between">
              <div>
                <span className="tag text-[10px] bg-eco-blue/10 border-eco-blue/20 text-eco-blue mb-3 inline-block uppercase tracking-wider font-mono">Cohort Overview</span>
                <h3 className="font-heading font-bold text-xl uppercase text-white mb-3">{cohorts[activeCohort].title}</h3>
                <p className="text-sm text-eco-muted-light leading-relaxed mb-6">{cohorts[activeCohort].desc}</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-2 items-center text-xs text-eco-blue font-heading font-bold">
                <Sparkles size={14} />
                <span>Focus: {cohorts[activeCohort].focus}</span>
            </div>
          </div>
        </div>

        {/* Bio-Banding Banner */}
        <div className="glow-card p-8 bg-gradient-to-br from-eco-surface to-eco-surface2 border border-eco-border rounded-2xl mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-eco-blue font-bold block">The Late-Bloomer Trap</span>
              <h3 className="font-display text-3xl uppercase text-white leading-none">
                BECAUSE BIOLOGY DOES NOT CARE ABOUT BIRTHDAYS
              </h3>
              <p className="text-sm text-eco-muted-light leading-relaxed">
                Kids born in the same year can be very different in size and strength. Standard teams only reward the biggest kids. This hurts kids who grow later (late bloomers). We use <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Bio-Banding</strong> <span className="text-xs text-eco-muted italic">(grouping kids by how much their body has actually grown, not by their age)</span>. This keeps smaller kids in the game. It also forces bigger kids to learn real skills instead of just using their size.
              </p>
            </div>
            <div className="lg:col-span-4 bg-eco-dark/60 p-5 rounded-xl border border-white/5 text-center">
              <p className="font-heading font-bold text-lg text-eco-blue-light uppercase tracking-wider mb-2">The Growth Garden</p>
              <p className="text-xs text-eco-muted-light leading-relaxed">
                Kids grow like plants in a garden, not like products on a factory line. By matching kids by how grown their bodies are, we keep sports fun and help them reach their best.
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Child Psychology Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="tag mb-3 inline-block">Coaching Science</span>
            <h2 className="font-display text-section uppercase tracking-wide text-white">
              CHILD PSYCHOLOGY
            </h2>
            <p className="text-eco-muted-light text-base max-w-2xl mx-auto mt-4 leading-relaxed text-balance">
              Understanding how kids think, feel, and grow is the secret weapon of great coaching. Here is why psychology is the core of our training.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="glow-card p-8 md:p-12 min-h-[440px] flex flex-col justify-between relative overflow-hidden bg-eco-surface/50 border border-eco-border rounded-3xl">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={psychologySlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="tag text-[10px] bg-eco-blue/10 border-eco-blue/20 text-eco-blue uppercase tracking-wider font-mono">
                        {psychologySlides[psychologySlide].tag}
                      </span>
                      <span className="text-[10px] font-mono text-eco-muted-light">
                        Concept {psychologySlide + 1} of {psychologySlides.length}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-heading font-bold text-xl md:text-2xl uppercase text-white mb-2 leading-none">
                        {psychologySlides[psychologySlide].title}
                      </h3>
                      <p className="text-xs md:text-sm text-eco-muted-light font-heading font-medium leading-relaxed">
                        {psychologySlides[psychologySlide].subtitle}
                      </p>
                    </div>

                    <div className="glow-card p-5 border-l-4 border-eco-blue bg-eco-dark/60 rounded-r-2xl mb-6">
                      <p className="text-white text-sm md:text-md italic font-heading font-semibold leading-relaxed">
                        "{psychologySlides[psychologySlide].quote}"
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {psychologySlides[psychologySlide].points.map((pt, idx) => (
                      <li key={idx} className="flex gap-3 items-start text-xs text-eco-muted-light leading-relaxed">
                        <CheckCircle className="text-eco-blue mt-0.5 flex-shrink-0" size={14} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => setPsychologySlide((prev) => (prev - 1 + psychologySlides.length) % psychologySlides.length)}
                  className="w-10 h-10 rounded-full border border-eco-border flex items-center justify-center text-eco-muted hover:text-white hover:border-eco-blue/30 transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex gap-2">
                  {psychologySlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPsychologySlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === psychologySlide
                          ? 'w-8 bg-eco-blue'
                          : 'w-1.5 bg-eco-muted/30 hover:bg-eco-muted/50'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setPsychologySlide((prev) => (prev + 1) % psychologySlides.length)}
                  className="w-10 h-10 rounded-full border border-eco-border flex items-center justify-center text-eco-muted hover:text-white hover:border-eco-blue/30 transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>

      {/* Backyard Practice Plan Lead Capture */}
      <div className="mb-24">
        <div className="glow-card p-8 md:p-12 bg-gradient-to-br from-eco-surface to-eco-surface2 border border-eco-blue/20 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-eco-blue/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-eco-navy-bright/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-eco-blue font-bold">Stop Yelling, Start Playing</span>
            <h2 className="font-display text-4xl md:text-5xl uppercase text-white leading-none">
              THE "DIFFERENTIAL SHOOTING"<br />
              <span className="gradient-text">BLUEPRINT</span>
            </h2>
            <p className="text-sm md:text-base text-eco-muted-light leading-relaxed max-w-xl mx-auto">
              Tired of watching your kid stand in driveway lines? Get our science-backed solo shooting plan. 5 challenges built to build a bulletproof shot through variability, not robotic repetition. No partner needed.
            </p>

            {practicePlanStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 pt-4"
              >
                <p className="font-heading font-bold text-white text-lg">SUCCESS! IT'S READY!</p>
                <button
                  onClick={() => setShowDrillsModal(true)}
                  className="inline-block bg-eco-blue text-eco-black font-heading font-bold text-base px-8 py-3.5 rounded-full hover:bg-white transition-all hover:scale-105 shadow-glow-sm"
                >
                  OPEN PRACTICE PLAN
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handlePracticePlanSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="Enter parent email"
                  className="input-field flex-grow !py-3 !px-4 text-sm bg-eco-dark/60"
                />
                <button
                  type="submit"
                  disabled={practicePlanStatus === 'submitting'}
                  className="btn-glow !py-3 !px-6 text-xs whitespace-nowrap"
                >
                  {practicePlanStatus === 'submitting' ? 'Sending...' : 'GET THE FREE BLUEPRINT'}
                </button>
              </form>
            )}
            <p className="text-[10px] text-eco-muted font-heading">
              We value your privacy. Your email will only be used to send the drills and EcoHoops updates.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Parent Onboarding / Promise */}
      <div className="glow-card p-8 bg-gradient-to-r from-eco-blue/5 via-transparent to-transparent border border-eco-blue/20 rounded-2xl mb-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="text-eco-blue" size={22} />
              <h3 className="font-display text-2xl uppercase tracking-wide text-white">THE PARENT COMPACT</h3>
            </div>
            <p className="text-sm text-eco-muted-light max-w-4xl leading-relaxed">
              We don't let toxic parent behavior ruin the gym. If you want to scream at referees, coach from the sidelines, or criticize mistakes on the car ride home, this isn't the program for you. We ask all parents to sign our Parent Compact—a commitment to cheer for effort, celebrate creative mistakes, and let the kids own their game.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-wrap gap-2">
            <span className="tag border-eco-blue/30 text-eco-blue">Cheer Effort</span>
            <span className="tag border-eco-blue/30 text-eco-blue">Praise Creativity</span>
            <span className="tag border-eco-blue/30 text-eco-blue">Quiet Sidelines</span>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <span className="tag mb-3 inline-block">The Skeptic's Corner</span>
          <h2 className="font-display text-section uppercase tracking-wide text-white">
            BUT IS THIS REALLY 'REAL' BASKETBALL?
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "Wait, is this just recess? Where are the structured plays?",
              a: "Some coaches make six-year-olds run complex plays they do not understand while adults yell at them. We do not do that. Kids learn by playing. We help them learn how to move and read the game. When they get older, they will understand complex plays much better. Running lines is easy. Teaching a kid to understand the game is where the magic happens."
            },
            {
              q: "Should my 7-year-old be playing 5v5 in a league?",
              a: "Watch a kids' 5v5 game. Count how long your child actually holds the ball. It is usually less than one minute! That is not playing basketball. It is just running around in a big shirt. In 5v5, the biggest kid does everything and others just watch. Our small games (2v2 and 3v3) give kids three times more ball touches, three times more choices, and ten times more fun."
            },
            {
              q: "If you don't keep score, how do they learn to compete?",
              a: "Competing is not about looking at a plastic scoreboard. It is about trying your best when the game is hard. Our kids compete all the time in 1v1, 2v2, tag, and target games. By not keeping a scoreboard, we take away the fear of losing. Kids try harder because they are not afraid of looking bad. They learn to love the challenge."
            }
          ].map((faq, index) => {
            const isOpen = activeFaq === index
            return (
              <div key={index} className="glow-card bg-eco-surface border border-eco-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-heading font-bold text-base text-white uppercase tracking-wider">
                    {faq.q}
                  </span>
                  <ChevronRight size={18} className={`text-eco-blue transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/5 bg-eco-dark/30"
                    >
                      <p className="p-6 text-sm text-eco-muted-light leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>

    {/* Exit Intent Popup */}
    <AnimatePresence>
      {showExitIntent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eco-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glow-card max-w-md w-full p-8 bg-eco-surface border border-eco-blue/30 rounded-3xl relative"
          >
            <button
              onClick={() => {
                setShowExitIntent(false)
                setExitIntentDismissed(true)
              }}
              className="absolute top-4 right-4 text-eco-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-eco-blue font-bold">DON'T LET THEM DRILL CONES</span>
              <h3 className="font-display text-3xl uppercase text-white leading-none">
                Get the Science-Backed Solo Shooting Plan
              </h3>
              <p className="text-xs text-eco-muted-light leading-relaxed">
                Do not make your kid run around orange cones. Download our 5 solo games based on brain science. We use <strong className="text-eco-blue font-bold uppercase tracking-wide font-heading">Variability</strong> <span className="text-xs text-eco-muted italic">(doing things differently each time)</span> to help their brain learn to adapt, not just copy.
              </p>

              {practicePlanStatus === 'success' ? (
                <div className="space-y-3">
                  <p className="text-sm font-heading font-semibold text-white">Your drills are unlocked!</p>
                  <button
                    onClick={() => {
                      setShowExitIntent(false)
                      setShowDrillsModal(true)
                    }}
                    className="w-full bg-eco-blue text-eco-black font-heading font-bold text-xs py-3 rounded-xl hover:bg-white transition-all"
                  >
                    OPEN PRACTICE PLAN
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePracticePlanSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="Enter parent email"
                    className="input-field !py-2.5 text-xs bg-eco-dark/60"
                  />
                  <button
                    type="submit"
                    disabled={practicePlanStatus === 'submitting'}
                    className="w-full btn-glow !py-3 text-xs"
                  >
                    {practicePlanStatus === 'submitting' ? 'Sending...' : 'GET THE DRILLS'}
                  </button>
                </form>
              )}

              <button
                onClick={() => {
                  setShowExitIntent(false)
                  setExitIntentDismissed(true)
                }}
                className="text-[10px] text-eco-muted hover:text-white transition-colors font-heading uppercase tracking-wider"
              >
                No thanks, I prefer standard orange cones.
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Drills Modal */}
    <AnimatePresence>
      {showDrillsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eco-black/90 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glow-card max-w-2xl w-full p-8 bg-eco-surface border border-eco-blue/30 rounded-3xl relative my-8"
          >
            <button
              onClick={() => setShowDrillsModal(false)}
              className="absolute top-4 right-4 text-eco-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-eco-blue font-bold">Unlocked Gift</span>
                <h3 className="font-display text-3xl uppercase text-white mt-1">DIFFERENTIAL SHOOTING PLAN</h3>
                <p className="text-xs text-eco-muted-light">5 solo shooting games built on brain science and mixing up how you play.</p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {[
                  {
                    name: "1. Changing Your Feet (Footing Variability)",
                    desc: "Shoot 10 times, but stand differently on every shot: (a) feet pressed tight together, (b) feet spread super wide like a sumo wrestler, (c) left foot forward and right foot back, (d) right foot forward and left foot back, and (e) standing on one foot."
                  },
                  {
                    name: "2. High and Low Shots (Release Point Variability)",
                    desc: "Shoot 10 times, modifying your release path and angle every time: (a) a hyper-high rainbow shot, (b) a very flat shot, (c) releasing from your forehead, (d) releasing from chest height, and (e) shooting with a one-handed push."
                  },
                  {
                    name: "3. Changing Your Body Shape (Posture Variability)",
                    desc: "Change your body shape at release: (a) shoot from a deep crouch (knees bent deep), (b) shoot with legs completely straight and stiff, (c) lean a little bit to the left, (d) lean a little bit to the right, and (e) shoot while shrugging your shoulders."
                  },
                  {
                    name: "4. Quick Moves Before the Shot (Movement Variability)",
                    desc: "Spin the ball to yourself and execute a different movement sequence immediately before catching and shooting: (a) jumping jack, catch, and shoot; (b) touch ground, catch, and shoot; (c) head roll, catch, and shoot; (d) hop backward, catch, and shoot; (e) lift one knee, catch, and shoot."
                  },
                  {
                    name: "5. Blind Spots (Visual Variability)",
                    desc: "Alter your vision: (a) line up, close your eyes, and shoot; (b) shoot with your non-dominant eye closed; (c) blink rapidly throughout the shot; (d) start facing away, spin 180 degrees to locate the rim, and shoot instantly."
                  }
                ].map((drill) => (
                  <div key={drill.name} className="p-4 bg-eco-dark/60 rounded-xl border border-white/5 space-y-1">
                    <h4 className="font-heading font-bold text-white text-sm uppercase">{drill.name}</h4>
                    <p className="text-xs text-eco-muted-light leading-relaxed">{drill.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleDownloadDrills}
                  className="btn-glow !py-2.5 !px-6 text-xs uppercase"
                  style={{ contentVisibility: 'auto' }}
                >
                  Download Drills
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </section>
)
}
